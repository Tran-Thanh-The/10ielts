import { AnswerHistory } from "@/domain/answer-histories/domain/answer-history";
import { AnswerHistoryEntity } from "../entities/answer-history.entity";
import { PracticeExerciseMapper } from "@/domain/practice-exercises/infrastructure/persistence/relational/mappers/practice-exercise.mapper";
import { LessonMapper } from "@/domain/lessons/infrastructure/persistence/relational/mappers/lesson.mapper";
import { CreateAnswerHistoryDto } from "@/domain/answer-histories/dto/create-answer-history.dto";
import { PracticeExerciseEntity } from "@/domain/practice-exercises/infrastructure/persistence/relational/entities/practice-exercise.entity";
import { LessonEntity } from "@/domain/lessons/infrastructure/persistence/relational/entities/lesson.entity";
import { StatusEnum } from "@/common/enums/status.enum";
import { UserMapper } from "@/domain/users/infrastructure/persistence/relational/mappers/user.mapper";

export class AnswerHistoryMapper {
  static toDomain(raw: AnswerHistoryEntity): AnswerHistory {
    const domainEntity = new AnswerHistory();
    domainEntity.id = raw.id;
    domainEntity.user = raw.user;
    domainEntity.practice = raw.practice;
    domainEntity.lesson = raw.lesson;
    domainEntity.totalScore = raw.totalScore;
    domainEntity.startedAt = raw.startedAt;
    domainEntity.completedAt = raw.completedAt;
    domainEntity.status = raw.status;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: AnswerHistory): AnswerHistoryEntity {
    const persistenceEntity = new AnswerHistoryEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.practice = domainEntity.practice;
    persistenceEntity.lesson = LessonMapper.toPersistence(domainEntity.lesson);
    persistenceEntity.user = UserMapper.toPersistence(domainEntity.user);
    persistenceEntity.totalScore = domainEntity.totalScore;
    persistenceEntity.startedAt = domainEntity.startedAt;
    persistenceEntity.completedAt = domainEntity.completedAt;
    persistenceEntity.status = domainEntity.status;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }

  static toModel(dto: CreateAnswerHistoryDto): AnswerHistory {
    const model = new AnswerHistory();
    if (dto.practice_id) {
      const practice = new PracticeExerciseEntity();
      practice.id = dto.practice_id;
      model.practice = practice;
    }

    if (dto.lesson_id) {
      const lesson = new LessonEntity();
      lesson.id = dto.lesson_id;
      model.lesson = lesson;
    }

    model.totalScore = dto.totalScore;
    model.startedAt = dto.startedAt;
    model.completedAt = dto.completedAt;
    if (!dto.status) {
      model.status = StatusEnum.IN_ACTIVE;
    } else {
      model.status = dto.status;
    }
    return model;
  }
}
