import { Module } from "@nestjs/common";
import { QuestionsService } from "./questions.service";
import { QuestionsController } from "./questions.controller";
import { RelationalQuestionPersistenceModule } from "./infrastructure/persistence/relational/relational-persistence.module";
import { LessonsModule } from "../lessons/lessons.module";
import { FilesLocalModule } from "@/files/infrastructure/uploader/local/files.module";
import { CategoriesModule } from "../categories/categories.module";
import { LessonCoursesModule } from "../lesson-courses/lesson-courses.module";
import { PracticeExercisesModule } from "../practice-exercises/practice-exercises.module";
import { AnswersModule } from "../answers/answers.module";

@Module({
  imports: [
    RelationalQuestionPersistenceModule,
    LessonsModule,
    CategoriesModule,
    FilesLocalModule,
    LessonCoursesModule,
    AnswersModule,
    PracticeExercisesModule,
  ],
  controllers: [QuestionsController],
  providers: [QuestionsService],
  exports: [QuestionsService, RelationalQuestionPersistenceModule],
})
export class QuestionsModule {}
