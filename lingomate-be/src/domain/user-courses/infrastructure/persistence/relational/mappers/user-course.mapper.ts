import { CourseEntity } from "@/domain/courses/infrastructure/persistence/relational/entities/course.entity";
import { UserCourse } from "@/domain/user-courses/domain/user-course";
import { CreateUserCourseDto } from "@/domain/user-courses/dto/create-user-course.dto";
import { UserEntity } from "@/domain/users/infrastructure/persistence/relational/entities/user.entity";
import { UserCourseEntity } from "../entities/user-course.entity";
import { UserCourseResponseDto } from "@/domain/user-courses/dto/user-course-response.dto";

export class UserCourseMapper {
  static toDomain(raw: UserCourseEntity): UserCourse {
    const domainEntity = new UserCourse();
    domainEntity.id = raw.id;
    domainEntity.user = raw.user;
    domainEntity.course = raw.course;
    domainEntity.status = raw.status;
    domainEntity.lastPosition = raw.lastPosition;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: UserCourse): UserCourseEntity {
    const persistenceEntity = new UserCourseEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.user = domainEntity.user;
    persistenceEntity.course = domainEntity.course;
    persistenceEntity.lastPosition = domainEntity.lastPosition;
    persistenceEntity.status = domainEntity.status;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }

  public static toModel(dto: CreateUserCourseDto): UserCourse {
    const model = new UserCourse();
    model.user = new UserEntity();
    model.user.id = Number(dto.user_id);

    model.course = new CourseEntity();
    model.course.id = dto.course_id;

    model.currentLesson = dto.currentLesson;
    model.lastPosition = dto.lastPosition;

    return model;
  }

  public static toDto(model: UserCourse): UserCourseResponseDto {
    const dto = new UserCourseResponseDto();
    dto.id = model.id;
    dto.user = { ...model.user };
    dto.course = { ...model.course };
    dto.currentLesson = model.currentLesson;
    dto.lastPosition = model.lastPosition;
    dto.status = model.status;
    dto.createdAt = model.createdAt;
    dto.updatedAt = model.updatedAt;
    return dto;
  }
}
