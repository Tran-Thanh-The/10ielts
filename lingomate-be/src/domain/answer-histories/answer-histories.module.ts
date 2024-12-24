import { FilesLocalModule } from "@/files/infrastructure/uploader/local/files.module";
import { Module } from "@nestjs/common";
import { AnswersModule } from "../answers/answers.module";
import { LessonsModule } from "../lessons/lessons.module";
import { PracticeExercisesModule } from "../practice-exercises/practice-exercises.module";
import { UsersModule } from "../users/users.module";
import { AnswerHistoriesController } from "./answer-histories.controller";
import { AnswerHistoriesService } from "./answer-histories.service";
import { RelationalAnswerHistoryPersistenceModule } from "./infrastructure/persistence/relational/relational-persistence.module";

@Module({
  imports: [
    RelationalAnswerHistoryPersistenceModule,
    PracticeExercisesModule,
    LessonsModule,
    AnswersModule,
    UsersModule,
    FilesLocalModule,
  ],
  controllers: [AnswerHistoriesController],
  providers: [AnswerHistoriesService],
  exports: [AnswerHistoriesService, RelationalAnswerHistoryPersistenceModule],
})
export class AnswerHistoriesModule {}
