import { FilesGoogleDriveModule } from "@/files/infrastructure/uploader/google-driver/files.module";
import { Module } from "@nestjs/common";
import { LessonCoursesModule } from "../lesson-courses/lesson-courses.module";
import { UserCoursesModule } from "../user-courses/user-courses.module";
import { UserLessonsModule } from "../user-lessons/user-lessons.module";
import { UsersModule } from "../users/users.module";
import { CoursesController } from "./courses.controller";
import { CoursesService } from "./courses.service";
import { RelationalCoursePersistenceModule } from "./infrastructure/persistence/relational/relational-persistence.module";

@Module({
  imports: [
    RelationalCoursePersistenceModule,
    LessonCoursesModule,
    UserCoursesModule,
    UserLessonsModule,
    UsersModule,
    FilesGoogleDriveModule,
  ],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService, RelationalCoursePersistenceModule],
})
export class CoursesModule {}
