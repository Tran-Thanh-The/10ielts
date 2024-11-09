import { Conversation } from "@/domain/conversations/domain/conversation";
import { ConversationEntity } from "../entities/conversation.entity";

export class ConversationMapper {
  static toDomain(raw: ConversationEntity): Conversation {
    const domainEntity = new Conversation();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Conversation): ConversationEntity {
    const persistenceEntity = new ConversationEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
