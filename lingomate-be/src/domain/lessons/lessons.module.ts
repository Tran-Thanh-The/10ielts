import { FilesLocalModule } from "@/files/infrastructure/uploader/local/files.module";
import { Module } from "@nestjs/common";
import { CoursesModule } from "../courses/courses.module";
import { LessonCoursesModule } from "../lesson-courses/lesson-courses.module";
import { RelationalLessonPersistenceModule } from "./infrastructure/persistence/relational/relational-persistence.module";
import { LessonsController } from "./lessons.controller";
import { LessonsService } from "./lessons.service";

@Module({
  imports: [
    RelationalLessonPersistenceModule,
    LessonCoursesModule,
    CoursesModule,
    FilesLocalModule,
  ],
  controllers: [LessonsController],
  providers: [LessonsService],
  exports: [LessonsService, RelationalLessonPersistenceModule],
})
export class LessonsModule {}
