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
    console.log(`Client connected: ${client.id}`);
    // Register the client upon connection
    this.registerClient(client.id, client);
  }

  handleDisconnect(client: any) {
    console.log(`Client disconnected: ${client.id}`);
    this.clients.delete(client.id);
  }

  registerClient(clientId: string, client: Socket) {
    this.clients.set(clientId, client);
    console.log(`Registered client with ID: ${clientId}`);
  }

  // Send a message to a specific client
  sendMessageToClient(clientId: string, message: string) {
    const client = this.clients.get(clientId);
    console.log(client);
    if (client) {
      console.log(`Sending message to client with ID: ${clientId}`);
      console.log(`Message: ${message}`);
      client.emit("newMessage", message);
    } else {
      console.error(`Client with ID: ${clientId} not found.`);
    }
  }
}
