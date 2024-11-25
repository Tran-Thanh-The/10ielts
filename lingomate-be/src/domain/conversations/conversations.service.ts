import { ChatRepository } from "@/domain/chats/infrastructure/persistence/chat.repository";
import { HttpStatus, Injectable } from "@nestjs/common";
import { ConversationRepository } from "./infrastructure/persistence/conversation.repository";
import { IPaginationOptions } from "@/utils/types/pagination-options";
import { Conversation } from "./domain/conversation";
import { FindAllConversationsDto } from "@/domain/conversations/dto/find-all-conversations.dto";
import { FindManyOptions } from "typeorm";
import { ConversationEntity } from "@/domain/conversations/infrastructure/persistence/relational/entities/conversation.entity";
import { Request } from "express";
import { UserConversationRepository } from "../user-conversations/infrastructure/persistence/user-conversation.repository";
import { ConversationTypesEnum } from "@/common/enums/conversation-types.enum";
import { UserRepository } from "../users/infrastructure/persistence/user.repository";

@Injectable()
export class ConversationsService {
  constructor(
    private readonly conversationRepository: ConversationRepository,
    private readonly chatRepository: ChatRepository,
    private readonly userRepository: UserRepository,
    private readonly userConversationRepository: UserConversationRepository,
  ) {}

  async createConversation(userId) {
    try {
      const userExist = await this.userRepository.findById(userId);
      if (!userExist) {
        throw new Error("User not exist");
      }
      const result = await this.conversationRepository.create({
        conversationType: ConversationTypesEnum.PRIVATE,
        conversationName: userExist.fullName ?? "",
      });
      await this.userConversationRepository.create({
        conversationId: result.id,
        userId: userId,
      });
      return {
        statusCode: HttpStatus.OK,
        message: "Conversation created successfully",
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Internal server error",
      };
    }
  }

  async joinConversation(conversationId: string, req: Request) {
    try {
      const user = req.user;
      const [existUserConversation, existUser, conversation] =
        await Promise.all([
          this.userConversationRepository.checkExistence({
            conversationId,
            userId: user?.["id"],
          }),
          this.userRepository.findById(user?.["id"]),
          this.conversationRepository.findById(conversationId),
        ]);
      if (existUserConversation) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: "User already in conversation",
        };
      }
      if (!existUser) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: "User not exist",
        };
      }
      if (
        conversation?.conversationType === ConversationTypesEnum.PRIVATE &&
        existUser.role?.name !== "Admin" &&
        existUser.role?.name !== "Staff"
      ) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: "User not allowed to join this conversation",
        };
      }
      await this.userConversationRepository.create({
        conversationId,
        userId: user?.["id"],
      });
      return {
        statusCode: HttpStatus.OK,
        message: "User joined the conversation successfully",
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Internal server error",
      };
    }
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    try {
      return {
        statusCode: HttpStatus.OK,
        message: this.conversationRepository.findAllWithPagination({
          paginationOptions: {
            page: paginationOptions.page,
            limit: paginationOptions.limit,
          },
        }),
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Internal server error",
      };
    }
  }

  findOne(id: Conversation["id"]) {
    return this.conversationRepository.findById(id);
  }

  remove(id: Conversation["id"]) {
    return this.conversationRepository.remove(id);
  }

  async getConversationsStaff(query: FindAllConversationsDto) {
    const options: FindManyOptions<ConversationEntity> = {};
    if (query.search) {
      options.where = {
        conversationName: query.search,
      };
    }
    const result =
      await this.conversationRepository.findAllWithSearchAndPagination(options);
    return {
      statusCode: HttpStatus.OK,
      message: result,
    };
  }

  async getConversationMessages(
    conversationId: string,
    query: FindAllConversationsDto,
    req: Request,
  ) {
    const result = await this.chatRepository.getMessagesByConversationId({
      conversationId,
      paginationOptions: {
        page: query.page ?? 1,
        limit: query.limit ?? 30,
      },
    });
    return result;
  }

  async getUserConversation(req: Request) {
    const user = req.user;
    try {
      const privateConversation =
        await this.conversationRepository.findConversationOfUser(user?.["id"]);
      return {
        statusCode: HttpStatus.OK,
        message: privateConversation,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.CONFLICT,
        message: error,
      };
    }
  }
}
