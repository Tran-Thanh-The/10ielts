import { redisConstants } from "@/common/redis/redis.constants";
import { RedisService } from "@/common/redis/redis.service";
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({ cors: true })
export class SocketGatewayService
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly redisService: RedisService) {}

  @WebSocketServer() server: Server;

  private clients: Map<string, Set<Socket>> = new Map();

  public handleConnection(client: Socket) {
    client.on(
      "register",
      (data: { clientId: string; conversationId: string }) => {
        const { clientId, conversationId } = data;
        this.registerClient(clientId, client);
        this.redisService
          .sadd(
            `${redisConstants.CHAT_PREFIX}:${clientId}:${conversationId}`,
            `${client.id}`,
          )
          .catch((error) => {
            console.error(error);
          });
        client.emit("registered", "Registration successful");
      },
    );
  }

  public handleDisconnect(client: Socket) {
    // Find and remove the client by its socket
    const clientId = Array.from(this.clients.entries()).find(([, sockets]) =>
      Array.from(sockets).some((socket) => socket.id === client.id),
    )?.[0];

    if (clientId) {
      const sockets = this.clients.get(clientId);
      if (sockets) {
        sockets.forEach((socket) => {
          if (socket.id === client.id) {
            sockets.delete(socket);
          }
        });
        if (sockets.size === 0) {
          this.clients.delete(clientId);
        }
      }
      this.redisService
        .srem(`${redisConstants.CHAT_PREFIX}:${clientId}`, client.id)
        .catch((error) => {
          console.error(error);
        });
    }
  }

  // Send a message to a specific client
  public sendMessageToClient(
    clientId: string,
    event: string,
    tokenIds: string[],
    message: string,
  ) {
    const sockets = this.clients.get(clientId);
    const clients = tokenIds
      .map((tokenId) =>
        sockets
          ? Array.from(sockets).find((socket) => socket.id === tokenId)
          : undefined,
      )
      .filter((socket) => socket);
    clients.map((client) => {
      if (client) {
        client.emit(event, message);
      }
    });
  }

  private registerClient(clientId: string, client: Socket) {
    if (!this.clients.has(clientId)) {
      this.clients.set(clientId, new Set());
    }
    this.clients.get(clientId)?.add(client);
  }
}
