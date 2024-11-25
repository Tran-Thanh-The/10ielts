import { redisConstants } from "@/common/redis/redis.constants";
import { HttpStatus, Injectable } from "@nestjs/common";
import { CreateChatDto } from "./dto/create-chat.dto";
import { ChatRepository } from "./infrastructure/persistence/chat.repository";
import { FilesLocalService } from "@/files/infrastructure/uploader/local/files.service";
import { Request } from "express";
import { ChatMapper } from "@/domain/chats/infrastructure/persistence/relational/mappers/chat.mapper";
import { SocketGatewayService } from "@/socket-gateway/socket-gateway.service";
import { RedisService } from "@/common/redis/redis.service";
import {
  createErrorResponse,
  createSuccessResponse,
} from "@/utils/create-response";
import { socketEvent } from "@/common/constants/socket.constant";

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
      const userId: string = req.user?.["id"];
      chatModel.userId = userId;

      if (file) {
        const uploadedFile = await this.filesLocalService.create(file);
        chatModel.file = uploadedFile.file;
      }

      const socketClient = `${redisConstants.CHAT_PREFIX}:${socketEvent.NEW_MESSAGE}:${chatModel.conversationId}`;
      const socketData = await this.redisService.smembers(socketClient);

      const result = await this.chatRepository.create(chatModel);
      this.socketGatewayService.sendMessageToClient(
        socketEvent.NEW_MESSAGE,
        socketEvent.NEW_MESSAGE,
        socketData,
        JSON.stringify(result),
      );

      return createSuccessResponse(HttpStatus.CREATED, result);
    } catch (error) {
      return createErrorResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
      );
    }
  }
}
