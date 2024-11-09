import { Chat } from "@/domain/chats/domain/chat";
import { ChatEntity } from "../entities/chat.entity";
import { FileMapper } from "@/files/infrastructure/persistence/relational/mappers/file.mapper";
import { CreateChatDto } from "@/domain/chats/dto/create-chat.dto";
import { ChatResponseDto } from "@/domain/chats/dto/chat-response.dto";

export class ChatMapper {
  static toDomain(raw: ChatEntity): Chat {
    const domainEntity = new Chat();
    if (raw.file) {
      domainEntity.file = FileMapper.toDomain(raw.file);
    }
    domainEntity.message = raw.message;
    domainEntity.conversationId = raw.conversationId;
    domainEntity.userId = raw.userId;
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Chat): ChatEntity {
    const persistenceEntity = new ChatEntity();
    if (domainEntity.file) {
      persistenceEntity.file = FileMapper.toPersistence(domainEntity.file);
    } else {
      persistenceEntity.file = null;
    }
    persistenceEntity.message = domainEntity.message;
    persistenceEntity.conversationId = domainEntity.conversationId;
    persistenceEntity.userId = domainEntity.userId;
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }

  static toModel(dto: CreateChatDto): Chat {
    const model = new Chat();
    model.message = dto.message;
    model.conversationId = dto.conversationId;
    return model;
  }

  static toDto(model: Chat): ChatResponseDto {
    const dto = new Chat();
    dto.id = model.id;
    dto.message = model.message;
    dto.conversationId = model.conversationId;
    dto.userId = model.userId;
    dto.createdAt = model.createdAt;
    dto.updatedAt = model.updatedAt;
    if (model.file) {
      dto.file = model.file;
    }
    return dto;
  }
}
