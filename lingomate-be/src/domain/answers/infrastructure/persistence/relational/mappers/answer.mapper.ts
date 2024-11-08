import { CreateAnswerDto } from "@/domain/answers/dto/create-answer.dto";
import { AnswerResponseDto } from "@/domain/answers/dto/response-answer.dto";
import { FileMapper } from "@/files/infrastructure/persistence/relational/mappers/file.mapper";
import { Answer } from "../../../../domain/answer";
import { AnswerEntity } from "../entities/answer.entity";
import { QuestionResponseDto } from "@/domain/questions/dto/response-question.dto";

export class AnswerMapper {
  static toDomain(raw: AnswerEntity): Answer {
    const domainEntity = new Answer();
    domainEntity.id = raw.id;
    domainEntity.content = raw.content;
    domainEntity.answerType = raw.answerType;
    if (raw.file) {
      domainEntity.file = FileMapper.toDomain(raw.file);
    }
    domainEntity.isCorrect = raw.isCorrect;
    domainEntity.question = raw.question;
    domainEntity.status = raw.status;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Answer): AnswerEntity {
    const persistenceEntity = new AnswerEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.answerType = domainEntity.answerType;
    persistenceEntity.content = domainEntity.content;
    if (domainEntity.file) {
      persistenceEntity.file = FileMapper.toPersistence(domainEntity.file);
    } else {
      persistenceEntity.file = null;
    }
    persistenceEntity.isCorrect = domainEntity.isCorrect;
    persistenceEntity.question = domainEntity.question;
    persistenceEntity.status = domainEntity.status;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }

  static toModel(dto: CreateAnswerDto): Answer {
    const model = new Answer();
    model.content = dto.content;
    model.answerType = dto.answerType;
    model.isCorrect = dto.isCorrect;

    return model;
  }

  static toDto(model: Answer): AnswerResponseDto {
    const dto = new AnswerResponseDto();
    dto.id = model.id;
    dto.content = model.content;
    if (model.file) {
      dto.file = model.file;
    }
    if (model.question) {
      dto.question = new QuestionResponseDto();
      Object.assign(dto.question, model.question);
    }
    dto.answerType = model.answerType;
    dto.isCorrect = model.isCorrect;
    dto.status = model.status;
    dto.createdAt = model.createdAt;
    dto.updatedAt = model.updatedAt;
    return dto;
  }
}
