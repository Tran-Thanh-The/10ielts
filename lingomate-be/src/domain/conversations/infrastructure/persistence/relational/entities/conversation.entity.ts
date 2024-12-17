import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { EntityRelationalHelper } from "@/utils/relational-entity-helper";
import { ApiProperty } from "@nestjs/swagger";
import { ChatEntity } from "@/domain/chats/infrastructure/persistence/relational/entities/chat.entity";
import { UserConversationEntity } from "@/domain/user-conversations/infrastructure/persistence/relational/entities/user-conversation.entity";
import { ConversationTypesEnum } from "@/common/enums/conversation-types.enum";

@Entity({
  name: "conversation",
})
export class ConversationEntity extends EntityRelationalHelper {
  @ApiProperty()
  @Column()
  conversationName: string;

  @ApiProperty({
    enum: ConversationTypesEnum,
  })
  @Column({
    type: "enum",
    enum: ConversationTypesEnum,
    default: ConversationTypesEnum.PRIVATE,
  })
  conversationType: ConversationTypesEnum;

  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => ChatEntity, (chat) => chat.conversation, {
    cascade: true,
  })
  chats: ChatEntity[];

  @OneToMany(
    () => UserConversationEntity,
    (userConversation) => userConversation.conversation,
    {
      cascade: true,
    },
  )
  userConversations: UserConversationEntity[];
}
