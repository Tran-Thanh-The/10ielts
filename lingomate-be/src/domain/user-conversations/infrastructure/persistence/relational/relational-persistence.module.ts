import { Module } from "@nestjs/common";
import { UserConversationRepository } from "../user-conversation.repository";
import { UserConversationRelationalRepository } from "./repositories/user-conversation.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserConversationEntity } from "./entities/user-conversation.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UserConversationEntity])],
  providers: [
    {
      provide: UserConversationRepository,
      useClass: UserConversationRelationalRepository,
    },
  ],
  exports: [UserConversationRepository],
})
export class RelationalUserConversationPersistenceModule {}
