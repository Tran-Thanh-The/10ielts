import { AnswerMapper } from "@/domain/answers/infrastructure/persistence/relational/mappers/answer.mapper";
import { LessonResponseDto } from "@/domain/lessons/dto/response-lesson.dto";
import { CreateQuestionDto } from "@/domain/questions/dto/create-question.dto";
import { QuestionResponseDto } from "@/domain/questions/dto/response-question.dto";
import { FileMapper } from "@/files/infrastructure/persistence/relational/mappers/file.mapper";
import { Question } from "../../../../domain/question";
import { QuestionEntity } from "../entities/question.entity";

export class QuestionMapper {
  static toDomain(raw: QuestionEntity): Question {
    const domainEntity = new Question();
    domainEntity.id = raw.id;
    domainEntity.title = raw.title;
    domainEntity.content = raw.content;
    domainEntity.explain = raw.explain;
    domainEntity.position = raw.position;
    if (raw.file) {
      domainEntity.file = FileMapper.toDomain(raw.file);
    }
    if (raw.answers) {
      domainEntity.answers = raw.answers.map((answer) =>
        AnswerMapper.toDomain(answer),
      );
    }
    domainEntity.time = raw.time;
    domainEntity.questionType = raw.questionType;
    domainEntity.fileType = raw.fileType;
    domainEntity.status = raw.status;
    domainEntity.lesson = raw.lesson;
    domainEntity.category = raw.category;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Question): QuestionEntity {
    const persistenceEntity = new QuestionEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.title = domainEntity.title;
    persistenceEntity.content = domainEntity.content;
    persistenceEntity.explain = domainEntity.explain;
    persistenceEntity.position = domainEntity.position;
    if (domainEntity.file) {
      persistenceEntity.file = FileMapper.toPersistence(domainEntity.file);
    } else {
      persistenceEntity.file = null;
    }
    persistenceEntity.time = domainEntity.time;
    persistenceEntity.questionType = domainEntity.questionType;
    persistenceEntity.fileType = domainEntity.fileType;
    persistenceEntity.status = domainEntity.status;
    persistenceEntity.lesson = domainEntity.lesson;
    persistenceEntity.category = domainEntity.category;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }

  static toModel(dto: CreateQuestionDto): Question {
    const model = new Question();
    model.title = dto.title;
    model.content = dto.content;
    model.explain = dto.explain;
    model.position = dto.position;
    model.time = dto.time;
    model.questionType = dto.questionType;
    model.fileType = dto.fileType;
    return model;
  }

  static toDto(model: Question): QuestionResponseDto {
    const dto = new QuestionResponseDto();
    dto.id = model.id;
    dto.title = model.title;
    dto.content = model.content;
    dto.explain = model.explain;
    dto.position = model.position;
    dto.questionType = model.questionType;
    dto.fileType = model.fileType;
    if (model.file) {
      dto.file = model.file;
    }
    dto.time = model.time;
    dto.status = model.status;
    dto.createdAt = model.createdAt;
    dto.updatedAt = model.updatedAt;

    if (model.lesson) {
      dto.lesson = new LessonResponseDto();
      Object.assign(dto.lesson, model.lesson);
    }
    dto.answers =
      model.answers?.map((answer) => AnswerMapper.toDto(answer)) ?? [];

    return dto;
  }
}
