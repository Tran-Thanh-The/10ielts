import { HttpStatus, Injectable } from "@nestjs/common";
import { CreateChatDto } from "./dto/create-chat.dto";
import { ChatRepository } from "./infrastructure/persistence/chat.repository";
import { FilesLocalService } from "@/files/infrastructure/uploader/local/files.service";
import { Request } from "express";
import { ChatMapper } from "@/domain/chats/infrastructure/persistence/relational/mappers/chat.mapper";
import { SocketGatewayService } from "@/socket-gateway/socket-gateway.service";
import { RedisService } from "@/common/redis/redis.service";
import { SocketEvent } from "@/common/constants/socket.constant";

@Injectable()
export class ChatsService {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly filesLocalService: FilesLocalService,
    private readonly socketGatewayService: SocketGatewayService,
    private readonly redisService: RedisService,
  ) {}

  async create(
    createChatDto: CreateChatDto,
    req: Request,
    file?: Express.Multer.File,
  ) {
    try {
      const chatModel = ChatMapper.toModel(createChatDto);
      const userId = req.user?.["id"];
      chatModel.userId = userId;
      if (file) {
        const uploadedFile = await this.filesLocalService.create(file);
        chatModel.file = uploadedFile.file;
      }
      const socketClient = `socket:client:${userId}_${SocketEvent.NEW_MESSAGE}`;
      const socketData = await this.redisService.get(socketClient);
      if (!socketData) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: "Socket client not found",
        };
      }
      const result = await this.chatRepository.create(chatModel);
      this.socketGatewayService.sendMessageToClient(
        `${userId}_${SocketEvent.NEW_MESSAGE}`,
        result.message,
      );
      return {
        statusCode: HttpStatus.CREATED,
        message: result,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }
}
