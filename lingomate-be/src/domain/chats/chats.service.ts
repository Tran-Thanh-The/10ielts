import { HttpStatus, Injectable } from "@nestjs/common";
import { CreateChatDto } from "./dto/create-chat.dto";
import { ChatRepository } from "./infrastructure/persistence/chat.repository";
import { FilesLocalService } from "@/files/infrastructure/uploader/local/files.service";
import { Request } from "express";
import { ChatMapper } from "@/domain/chats/infrastructure/persistence/relational/mappers/chat.mapper";
import { SocketGatewayService } from "@/socket-gateway/socket-gateway.service";

@Injectable()
export class ChatsService {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly filesLocalService: FilesLocalService,
    private readonly socketGatewayService: SocketGatewayService,
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
      const result = await this.chatRepository.create(chatModel);
      console.log("Sending message to client...");
      console.log("Message: ", chatModel.message);
      this.socketGatewayService.sendMessageToClient(
        "testClient123", // Use the actual user ID from the request
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
