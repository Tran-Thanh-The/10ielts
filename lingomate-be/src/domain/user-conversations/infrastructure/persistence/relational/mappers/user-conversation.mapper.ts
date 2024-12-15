import { UserConversation } from "@/domain/user-conversations/domain/user-conversation";
import { UserConversationEntity } from "../entities/user-conversation.entity";

export class UserConversationMapper {
  static toDomain(raw: UserConversationEntity): UserConversation {
    const domainEntity = new UserConversation();
    domainEntity.conversationId = raw.conversationId;
    domainEntity.userId = raw.userId;
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: UserConversation): UserConversationEntity {
    const persistenceEntity = new UserConversationEntity();
    persistenceEntity.conversationId = domainEntity.conversationId;
    persistenceEntity.userId = domainEntity.userId;
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
