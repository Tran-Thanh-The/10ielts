import { Module } from "@nestjs/common";
import { ConversationsService } from "./conversations.service";
import { ConversationsController } from "./conversations.controller";
import { RelationalConversationPersistenceModule } from "./infrastructure/persistence/relational/relational-persistence.module";

@Module({
  imports: [RelationalConversationPersistenceModule],
  controllers: [ConversationsController],
  providers: [ConversationsService],
  exports: [ConversationsService, RelationalConversationPersistenceModule],
})
export class ConversationsModule {}
