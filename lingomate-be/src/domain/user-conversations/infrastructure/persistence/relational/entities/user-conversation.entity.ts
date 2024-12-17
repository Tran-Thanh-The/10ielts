import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { EntityRelationalHelper } from "@/utils/relational-entity-helper";
import { ApiProperty } from "@nestjs/swagger";
import { ConversationEntity } from "@/domain/conversations/infrastructure/persistence/relational/entities/conversation.entity";
import { UserEntity } from "@/domain/users/infrastructure/persistence/relational/entities/user.entity";

@Entity({
  name: "user_conversation",
})
export class UserConversationEntity extends EntityRelationalHelper {
  @ApiProperty()
  @Column()
  conversationId: string;

  @ApiProperty()
  @Column()
  userId: string;

  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(
    () => ConversationEntity,
    (conversation) => conversation.userConversations,
    {
      eager: true,
    },
  )
  @JoinColumn({ name: "conversationId" })
  conversation: ConversationEntity;

  @ManyToOne(() => UserEntity, (user) => user.userConversations, {
    eager: true,
  })
  @JoinColumn({ name: "userId" })
  user: UserEntity;
}
