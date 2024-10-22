import { Module } from "@nestjs/common";
import { CourseRepository } from "../course.repository";
import { CourseRelationalRepository } from "./repositories/course.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CourseEntity } from "./entities/course.entity";
import { UserCourseEntity } from "@/domain/user-courses/infrastructure/persistence/relational/entities/user-course.entity";
import { UserLessonEntity } from "@/domain/user-lessons/infrastructure/persistence/relational/entities/user-lesson.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CourseEntity,
      UserCourseEntity,
      UserLessonEntity,
    ]),
  ],
  providers: [
    {
      provide: CourseRepository,
      useClass: CourseRelationalRepository,
    },
  ],
  exports: [CourseRepository],
})
export class RelationalCoursePersistenceModule {}
