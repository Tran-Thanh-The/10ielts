import { Module } from "@nestjs/common";
import { ChatsService } from "./chats.service";
import { ChatsController } from "./chats.controller";
import { RelationalChatPersistenceModule } from "./infrastructure/persistence/relational/relational-persistence.module";
import { FilesLocalModule } from "@/files/infrastructure/uploader/local/files.module";
import { SocketGatewayModule } from "@/socket-gateway/socket-gateway.module";

@Module({
  imports: [
    RelationalChatPersistenceModule,
    FilesLocalModule,
    SocketGatewayModule,
  ],
  controllers: [ChatsController],
  providers: [ChatsService],
  exports: [ChatsService, RelationalChatPersistenceModule],
})
export class ChatsModule {}
