import { Module } from "@nestjs/common";
import { ConversationsService } from "./conversations.service";
import { ConversationsController } from "./conversations.controller";
import { RelationalConversationPersistenceModule } from "./infrastructure/persistence/relational/relational-persistence.module";
import { ChatsModule } from "../chats/chats.module";
import { UserConversationsModule } from "../user-conversations/user-conversations.module";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [
    RelationalConversationPersistenceModule,
    ChatsModule,
    UserConversationsModule,
    UsersModule,
  ],
  controllers: [ConversationsController],
  providers: [ConversationsService],
  exports: [ConversationsService, RelationalConversationPersistenceModule],
})
export class ConversationsModule {}
