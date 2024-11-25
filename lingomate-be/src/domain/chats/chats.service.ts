import { Injectable } from "@nestjs/common";
import { CreateChatDto } from "./dto/create-chat.dto";
import { ChatRepository } from "./infrastructure/persistence/chat.repository";
import { FilesLocalService } from "@/files/infrastructure/uploader/local/files.service";
import { Request } from "express";
import { ChatMapper } from "@/domain/chats/infrastructure/persistence/relational/mappers/chat.mapper";

@Injectable()
export class ChatsService {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly filesLocalService: FilesLocalService,
  ) {}

  async create(
    createChatDto: CreateChatDto,
    req: Request,
    file?: Express.Multer.File,
  ) {
    const chatModel = ChatMapper.toModel(createChatDto);
    const userId = req.user?.["id"];
    chatModel.userId = userId;
    if (file) {
      const uploadedFile = await this.filesLocalService.create(file);
      chatModel.file = uploadedFile.file;
    }
    return this.chatRepository.create(chatModel);
  }
}
