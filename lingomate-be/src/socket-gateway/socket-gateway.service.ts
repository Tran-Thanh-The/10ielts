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

  private clients: Map<string, Socket> = new Map();

  handleConnection(client: Socket) {
    client.on("register", (data: { clientId: string }) => {
      const { clientId } = data;
      this.registerClient(clientId, client);
      this.redisService
        .set(
          `socket:client:${clientId}`,
          JSON.stringify({ socketId: client.id }),
        )
        .catch((error) => {
          console.error(error);
        });
    });
  }

  handleDisconnect(client: Socket) {
    // Find and remove the client by its socket
    const clientId = Array.from(this.clients.entries()).find(
      ([, socket]) => socket.id === client.id,
    )?.[0];

    if (clientId) {
      this.clients.delete(clientId);
      this.redisService.del(`socket:client:${clientId}`).catch((error) => {
        console.error(error);
      });
    }
  }

  private registerClient(clientId: string, client: Socket) {
    this.clients.set(clientId, client);
  }

  // Send a message to a specific client
  sendMessageToClient(clientId: string, message: string) {
    const client = this.clients.get(clientId);
    if (client) {
      client.emit("newMessage", message);
    } else {
      console.error(`Client with ID: ${clientId} not found.`);
    }
  }
}
