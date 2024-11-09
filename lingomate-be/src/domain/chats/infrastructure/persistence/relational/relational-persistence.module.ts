import { Module } from "@nestjs/common";
import { ChatRepository } from "../chat.repository";
import { ChatRelationalRepository } from "./repositories/chat.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatEntity } from "./entities/chat.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ChatEntity])],
  providers: [
    {
      provide: ChatRepository,
      useClass: ChatRelationalRepository,
    },
  ],
  exports: [ChatRepository],
})
export class RelationalChatPersistenceModule {}
