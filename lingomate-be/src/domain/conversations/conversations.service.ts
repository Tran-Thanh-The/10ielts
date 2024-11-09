import { Injectable } from "@nestjs/common";
import { CreateConversationDto } from "./dto/create-conversation.dto";
import { UpdateConversationDto } from "./dto/update-conversation.dto";
import { ConversationRepository } from "./infrastructure/persistence/conversation.repository";
import { IPaginationOptions } from "@/utils/types/pagination-options";
import { Conversation } from "./domain/conversation";

@Injectable()
export class ConversationsService {
  constructor(
    private readonly conversationRepository: ConversationRepository,
  ) {}

  create(createConversationDto: CreateConversationDto) {
    return this.conversationRepository.create(createConversationDto);
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.conversationRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findOne(id: Conversation["id"]) {
    return this.conversationRepository.findById(id);
  }

  update(id: Conversation["id"], updateConversationDto: UpdateConversationDto) {
    return this.conversationRepository.update(id, updateConversationDto);
  }

  remove(id: Conversation["id"]) {
    return this.conversationRepository.remove(id);
  }
}
