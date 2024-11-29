/* eslint-disable prettier/prettier */
import { redisConstants } from "@/common/redis/redis.constants";
import { RedisService } from "@/common/redis/redis.service";
import { JwtService } from "@nestjs/jwt";
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { socketEmitEventName } from "./socket.constants";

@WebSocketGateway({ cors: true, path: "/ws" })
export class SocketGatewayService
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService, // Inject JwtService
  ) {}

  @WebSocketServer() server: Server;

  private clients: Map<string, Set<Socket>> = new Map();

  public handleConnection(client: Socket) {
    client.on(
      "register",
      async (data: {
        clientId: string;
        userId: string | number;
        jwtToken: string;
      }) => {
        const { clientId, userId, jwtToken } = data;
        try {
          // Verify the JWT token
          const decoded = this.jwtService.verify(jwtToken);
          if (decoded.id !== userId) {
            throw new Error("Invalid token");
          }
          this.registerClient(clientId, client);
          await this.redisService.hset(
            `${redisConstants.CHAT_PREFIX}:${clientId}`,
            userId.toString(),
            client.id,
            86400,
          );
          client.emit(
            socketEmitEventName.REGISTERED,
            "Registration successful",
          );
          // await this.broadCastOnlineUser(client, clientId);
        } catch (error) {
          client.emit(
            socketEmitEventName.CONNECT_ERROR,
            `Registration failed: ${error.message}`,
          );
          client.disconnect();
        }
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
      this.removeFromRedis(clientId, client.id)
        .catch((error) => {
          console.error(error);
        });
      // this.broadCastOnlineUser(client, clientId)
      //   .catch((error) => {
      //     console.error(error);
      //   });
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

  private async removeFromRedis(clientId: string, userId: string) {
    try {
      const allField = await this.redisService.hgetall(
        `${redisConstants.CHAT_PREFIX}:${clientId}`,
      )
      const field = Object.entries(allField).find(
        ([, value]) => value === userId,
      );
      if (field) {
        await this.redisService.hdel(
          `${redisConstants.CHAT_PREFIX}:${clientId}`,
          field[0],
        );
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // private async broadCastOnlineUser(client: Socket, clientId: string) {
  //   try {
  //     const onlineUsers = await this.redisService.hlen(`${redisConstants.CHAT_PREFIX}:${clientId}`);
  //     client.emit(socketEmitEventName.ONLINE_USERS, onlineUsers);
  //   } catch (error) {
  //     throw new Error(error.message);
  //   }
  // }
}
