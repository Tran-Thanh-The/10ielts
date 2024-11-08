import { Module } from "@nestjs/common";
import { AnswerHistoryRepository } from "../answer-history.repository";
import { AnswerHistoryRelationalRepository } from "./repositories/answer-history.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AnswerHistoryEntity } from "./entities/answer-history.entity";

@Module({
  imports: [TypeOrmModule.forFeature([AnswerHistoryEntity])],
  providers: [
    {
      provide: AnswerHistoryRepository,
      useClass: AnswerHistoryRelationalRepository,
    },
  ],
  exports: [AnswerHistoryRepository],
})
export class RelationalAnswerHistoryPersistenceModule {}
