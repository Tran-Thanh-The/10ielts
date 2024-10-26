import { UserLesson } from "@/domain/user-lessons/domain/user-lesson";
import { UserLessonEntity } from "../entities/user-lesson.entity";
import { CreateUserLessonDto } from "@/domain/user-lessons/dto/create-user-lesson.dto";
import { UserEntity } from "@/domain/users/infrastructure/persistence/relational/entities/user.entity";
import { LessonEntity } from "@/domain/lessons/infrastructure/persistence/relational/entities/lesson.entity";

export class UserLessonMapper {
  static toDomain(raw: UserLessonEntity): UserLesson {
    const domainEntity = new UserLesson();
    domainEntity.id = raw.id;
    domainEntity.user = raw.user;
    domainEntity.lesson = raw.lesson;
    domainEntity.status = raw.status;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: UserLesson): UserLessonEntity {
    const persistenceEntity = new UserLessonEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.user = domainEntity.user;
    persistenceEntity.lesson = domainEntity.lesson;
    persistenceEntity.status = domainEntity.status;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }

  public static toModel(dto: CreateUserLessonDto): UserLesson {
    const model = new UserLesson();
    model.user = new UserEntity();
    Object.assign(model.user, dto.user);
    model.lesson = new LessonEntity();
    Object.assign(model.lesson, dto.lesson);
    return model;
  }
}
