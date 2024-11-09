import { Module } from "@nestjs/common";
import { ConversationRepository } from "../conversation.repository";
import { ConversationRelationalRepository } from "./repositories/conversation.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConversationEntity } from "./entities/conversation.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ConversationEntity])],
  providers: [
    {
      provide: ConversationRepository,
      useClass: ConversationRelationalRepository,
    },
  ],
  exports: [ConversationRepository],
})
export class RelationalConversationPersistenceModule {}
