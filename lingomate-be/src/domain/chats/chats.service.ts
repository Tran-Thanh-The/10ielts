import { Injectable } from "@nestjs/common";
import { CreateChatDto } from "./dto/create-chat.dto";
import { UpdateChatDto } from "./dto/update-chat.dto";
import { ChatRepository } from "./infrastructure/persistence/chat.repository";
import { IPaginationOptions } from "@/utils/types/pagination-options";
import { Chat } from "./domain/chat";
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

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.chatRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findOne(id: Chat["id"]) {
    return this.chatRepository.findById(id);
  }

  update(id: Chat["id"], updateChatDto: UpdateChatDto) {
    return this.chatRepository.update(id, updateChatDto);
  }

  remove(id: Chat["id"]) {
    return this.chatRepository.remove(id);
  }
}
