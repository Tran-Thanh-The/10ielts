import {
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { EntityRelationalHelper } from "@/utils/relational-entity-helper";
import { ApiProperty } from "@nestjs/swagger";
import { ChatEntity } from "@/domain/chats/infrastructure/persistence/relational/entities/chat.entity";

@Entity({
  name: "conversation",
})
export class ConversationEntity extends EntityRelationalHelper {
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
}
