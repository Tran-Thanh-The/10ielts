import { Module } from "@nestjs/common";
import { UserConversationsService } from "./user-conversations.service";
import { UserConversationsController } from "./user-conversations.controller";
import { RelationalUserConversationPersistenceModule } from "./infrastructure/persistence/relational/relational-persistence.module";

@Module({
  imports: [RelationalUserConversationPersistenceModule],
  controllers: [UserConversationsController],
  providers: [UserConversationsService],
  exports: [
    UserConversationsService,
    RelationalUserConversationPersistenceModule,
  ],
})
export class UserConversationsModule {}
