import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { EntityRelationalHelper } from "@/utils/relational-entity-helper";
import { ApiProperty } from "@nestjs/swagger";
import { UserEntity } from "@/domain/users/infrastructure/persistence/relational/entities/user.entity";
import { ConversationEntity } from "@/domain/conversations/infrastructure/persistence/relational/entities/conversation.entity";
import { FileEntity } from "@/files/infrastructure/persistence/relational/entities/file.entity";

@Entity({
  name: "chat",
})
export class ChatEntity extends EntityRelationalHelper {
  @ApiProperty({
    type: () => FileEntity,
  })
  @OneToOne(() => FileEntity, {
    eager: true,
  })
  @JoinColumn()
  file?: FileEntity | null;

  @ApiProperty()
  @Column()
  message: string;

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

  @ManyToOne(() => UserEntity, (user) => user.chats, {
    eager: true,
  })
  @JoinColumn({ name: "userId" })
  user: UserEntity;

  @ManyToOne(() => ConversationEntity, (conversation) => conversation.chats, {
    eager: true,
  })
  @JoinColumn({ name: "conversationId" })
  conversation: ConversationEntity;
}
