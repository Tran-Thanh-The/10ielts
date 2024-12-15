import { UserAnswer } from "@/domain/user-answers/domain/user-answer";
import { UserAnswerEntity } from "../entities/user-answer.entity";
import { CreateUserAnswerDto } from "@/domain/user-answers/dto/create-user-answer.dto";
import { AnswerHistoryEntity } from "@/domain/answer-histories/infrastructure/persistence/relational/entities/answer-history.entity";
import { QuestionEntity } from "@/domain/questions/infrastructure/persistence/relational/entities/question.entity";
import { UserAnswerResponseDto } from "@/domain/user-answers/dto/response-user-answer.dto";
import { QuestionMapper } from "@/domain/questions/infrastructure/persistence/relational/mappers/question.mapper";

export class UserAnswerMapper {
  static toDomain(raw: UserAnswerEntity): UserAnswer {
    const domainEntity = new UserAnswer();
    domainEntity.id = raw.id;
    domainEntity.answerHistory = raw.answerHistory;
    domainEntity.question = raw.question;
    domainEntity.answerPick = raw.answerPick;
    domainEntity.status = raw.status;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: UserAnswer): UserAnswerEntity {
    const persistenceEntity = new UserAnswerEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.answerHistory = domainEntity.answerHistory;
    persistenceEntity.question = domainEntity.question;
    persistenceEntity.answerPick = domainEntity.answerPick;
    persistenceEntity.status = domainEntity.status;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }

  static toModel(dto: CreateUserAnswerDto): UserAnswer {
    const model = new UserAnswer();
    if (dto.answerHistoryId) {
      model.answerHistory = new AnswerHistoryEntity();
      model.answerHistory.id = dto.answerHistoryId;
    }
    if (dto.question_id) {
      model.question = new QuestionEntity();
      model.question.id = dto.question_id;
    }
    model.answerPick = dto.answerPick;

    return model;
  }

  static toDto(model: UserAnswer): UserAnswerResponseDto {
    const dto = new UserAnswerResponseDto();
    dto.id = model.id;
    if (model.answerHistory) {
      dto.answerHistoryId = model.answerHistory.id;
    }
    dto.question = model.question;
    dto.answerPick = model.answerPick;
    dto.status = model.status;
    dto.createdAt = model.createdAt;
    dto.updatedAt = model.updatedAt;

    return dto;
  }
}
