import { FilesGoogleDriveModule } from "@/files/infrastructure/uploader/google-driver/files.module";
import { Module } from "@nestjs/common";
import { AnswersModule } from "../answers/answers.module";
import { CategoriesModule } from "../categories/categories.module";
import { LessonCoursesModule } from "../lesson-courses/lesson-courses.module";
import { LessonsModule } from "../lessons/lessons.module";
import { PracticeExercisesModule } from "../practice-exercises/practice-exercises.module";
import { RelationalQuestionPersistenceModule } from "./infrastructure/persistence/relational/relational-persistence.module";
import { QuestionsController } from "./questions.controller";
import { QuestionsService } from "./questions.service";

@Module({
  imports: [
    RelationalQuestionPersistenceModule,
    LessonsModule,
    CategoriesModule,
    FilesGoogleDriveModule,
    LessonCoursesModule,
    AnswersModule,
    PracticeExercisesModule,
  ],
  controllers: [QuestionsController],
  providers: [QuestionsService],
  exports: [QuestionsService, RelationalQuestionPersistenceModule],
})
export class QuestionsModule {}
