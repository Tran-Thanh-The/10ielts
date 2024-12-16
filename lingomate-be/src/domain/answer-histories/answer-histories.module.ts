import { Module } from "@nestjs/common";
import { AnswerHistoriesService } from "./answer-histories.service";
import { AnswerHistoriesController } from "./answer-histories.controller";
import { RelationalAnswerHistoryPersistenceModule } from "./infrastructure/persistence/relational/relational-persistence.module";
import { PracticeExercisesModule } from "../practice-exercises/practice-exercises.module";
import { LessonsModule } from "../lessons/lessons.module";
import { AnswersModule } from "../answers/answers.module";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [
    RelationalAnswerHistoryPersistenceModule,
    PracticeExercisesModule,
    LessonsModule,
    AnswersModule,
    UsersModule,
  ],
  controllers: [AnswerHistoriesController],
  providers: [AnswerHistoriesService],
  exports: [AnswerHistoriesService, RelationalAnswerHistoryPersistenceModule],
})
export class AnswerHistoriesModule {}
