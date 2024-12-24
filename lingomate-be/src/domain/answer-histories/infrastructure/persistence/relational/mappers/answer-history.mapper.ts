import { StatusEnum } from "@/common/enums/status.enum";
import { AnswerHistory } from "@/domain/answer-histories/domain/answer-history";
import { CreateAnswerHistoryDto } from "@/domain/answer-histories/dto/create-answer-history.dto";
import { ResponseAnswerHistoryDto } from "@/domain/answer-histories/dto/response-answer-history.dto";
import { LessonEntity } from "@/domain/lessons/infrastructure/persistence/relational/entities/lesson.entity";
import { PracticeExerciseEntity } from "@/domain/practice-exercises/infrastructure/persistence/relational/entities/practice-exercise.entity";
import { UserEntity } from "@/domain/users/infrastructure/persistence/relational/entities/user.entity";
import { AnswerHistoryEntity } from "../entities/answer-history.entity";
import { FileMapper } from "./../../../../../../files/infrastructure/persistence/relational/mappers/file.mapper";

export class AnswerHistoryMapper {
  static toDomain(raw: AnswerHistoryEntity): AnswerHistory {
    const domainEntity = new AnswerHistory();
    domainEntity.id = raw.id;
    domainEntity.answers = raw.answers;
    domainEntity.user = raw.user;
    domainEntity.practice = raw.practice;
    domainEntity.lesson = raw.lesson;
    domainEntity.totalScore = raw.totalScore;
    domainEntity.startedAt = raw.startedAt;
    domainEntity.completedAt = raw.completedAt;
    domainEntity.status = raw.status;
    if (raw.audioAnswer) {
      domainEntity.audioAnswer = FileMapper.toDomain(raw.audioAnswer);
    }
    domainEntity.writingAnswer = raw.writingAnswer;
    domainEntity.teacherScore = raw.teacherScore;
    domainEntity.teacherFeedback = raw.teacherFeedback;
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
    persistenceEntity.lesson = domainEntity.lesson;
    persistenceEntity.answers = domainEntity.answers;
    persistenceEntity.user = domainEntity.user;
    persistenceEntity.totalScore = domainEntity.totalScore;
    persistenceEntity.startedAt = domainEntity.startedAt;
    persistenceEntity.completedAt = domainEntity.completedAt;
    persistenceEntity.status = domainEntity.status;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;
    if (domainEntity.audioAnswer) {
      persistenceEntity.audioAnswer = FileMapper.toPersistence(
        domainEntity.audioAnswer,
      );
    } else {
      persistenceEntity.audioAnswer = null;
    }
    persistenceEntity.writingAnswer = domainEntity.writingAnswer;
    persistenceEntity.teacherScore = domainEntity.teacherScore;
    persistenceEntity.teacherFeedback = domainEntity.teacherFeedback;

    return persistenceEntity;
  }

  static toModel(dto: CreateAnswerHistoryDto): AnswerHistory {
    const model = new AnswerHistory();
    if (dto.user_id) {
      model.user = new UserEntity();
      model.user.id = dto.user_id;
    }
    if (dto.practice_id) {
      model.practice = new PracticeExerciseEntity();
      model.practice.id = dto.practice_id;
    }

    if (dto.lesson_id) {
      model.lesson = new LessonEntity();
      model.lesson.id = dto.lesson_id;
    }
    model.answers = dto.answers;
    model.totalScore = dto.totalScore;
    model.startedAt = dto.startedAt;
    model.completedAt = new Date();
    if (!dto.status) {
      model.status = StatusEnum.IN_ACTIVE;
    } else {
      model.status = dto.status;
    }
    model.writingAnswer = dto.writingAnswer;
    model.teacherScore = dto.teacherScore;
    model.teacherFeedback = dto.teacherFeedback;
    return model;
  }

  static toDto(model: AnswerHistory): ResponseAnswerHistoryDto {
    const dto = new ResponseAnswerHistoryDto();
    dto.id = model.id;
    dto.answers = model.answers;
    if (model.user) {
      dto.user_id = model.user?.id;
    }
    if (model.lesson) {
      dto.lesson_id = model.lesson.id;
    }
    if (model.practice) {
      dto.practice_id = model.practice.id;
    }
    dto.totalScore = model.totalScore;
    dto.status = model.status;
    dto.startedAt = model.startedAt;
    dto.completedAt = model.completedAt;
    dto.createdAt = model.createdAt;
    dto.updatedAt = model.updatedAt;
    if (model.audioAnswer) {
      dto.audioAnswer = model.audioAnswer;
    }
    dto.writingAnswer = model.writingAnswer;
    dto.teacherScore = model.teacherScore;
    dto.teacherFeedback = model.teacherFeedback;
    return dto;
  }
}
