import { Module } from "@nestjs/common";
import { CourseRepository } from "../course.repository";
import { CourseRelationalRepository } from "./repositories/course.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CourseEntity } from "./entities/course.entity";
import { UserCourseEntity } from "@/domain/user-courses/infrastructure/persistence/relational/entities/user-course.entity";
import { UserLessonEntity } from "@/domain/user-lessons/infrastructure/persistence/relational/entities/user-lesson.entity";
import { UserEntity } from "@/domain/users/infrastructure/persistence/relational/entities/user.entity";
import { CourseInvoicesEntity } from "@/domain/course-invoices/infrastructure/persistence/relational/entities/course-invoices.entity";
import { UserInvoicesEntity } from "@/domain/user-invoices/infrastructure/persistence/relational/entities/user-invoices.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CourseEntity,
      UserCourseEntity,
      UserLessonEntity,
      UserEntity,
      CourseInvoicesEntity,
      UserInvoicesEntity,
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
