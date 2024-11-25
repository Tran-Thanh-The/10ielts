import { Injectable } from "@nestjs/common";
import { CreateUserConversationDto } from "./dto/create-user-conversation.dto";
import { UpdateUserConversationDto } from "./dto/update-user-conversation.dto";
import { UserConversationRepository } from "./infrastructure/persistence/user-conversation.repository";
import { IPaginationOptions } from "@/utils/types/pagination-options";
import { UserConversation } from "./domain/user-conversation";

@Injectable()
export class UserConversationsService {
  constructor(
    private readonly userConversationRepository: UserConversationRepository,
  ) {}

  create(createUserConversationDto: CreateUserConversationDto) {
    return this.userConversationRepository.create(createUserConversationDto);
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.userConversationRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findOne(id: UserConversation["id"]) {
    return this.userConversationRepository.findById(id);
  }

  update(
    id: UserConversation["id"],
    updateUserConversationDto: UpdateUserConversationDto,
  ) {
    return this.userConversationRepository.update(
      id,
      updateUserConversationDto,
    );
  }

  remove(id: UserConversation["id"]) {
    return this.userConversationRepository.remove(id);
  }
}
