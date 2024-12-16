import { AnswerMapper } from "@/domain/answers/infrastructure/persistence/relational/mappers/answer.mapper";
import { LessonEntity } from "@/domain/lessons/infrastructure/persistence/relational/entities/lesson.entity";
import { PracticeExerciseEntity } from "@/domain/practice-exercises/infrastructure/persistence/relational/entities/practice-exercise.entity";
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
    if(raw.fileType) {
      domainEntity.fileType = raw.fileType;
    }
    domainEntity.status = raw.status;
    domainEntity.lesson = raw.lesson;
    domainEntity.practice = raw.practice;
    domainEntity.category = raw.category;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    domainEntity.createdBy = raw.createdBy;
    domainEntity.updatedBy = raw.updatedBy;

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
    persistenceEntity.practice = domainEntity.practice;
    persistenceEntity.category = domainEntity.category;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;
    persistenceEntity.createdBy = domainEntity.createdBy;
    persistenceEntity.updatedBy = domainEntity.updatedBy;

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
    if (dto.lesson_id) {
      model.lesson = new LessonEntity();
      model.lesson.id = dto.lesson_id;
    }
    if (dto.practice_id) {
      model.practice = new PracticeExerciseEntity();
      model.practice.id = dto.practice_id;
    }

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
    if (model.fileType) {
      dto.fileType = model.fileType;
    }
    if (model.file) {
      dto.file = model.file;
    }
    dto.time = model.time;
    dto.status = model.status;
    dto.createdAt = model.createdAt;
    dto.updatedAt = model.updatedAt;
    dto.createdBy = model.createdBy;
    dto.updatedBy = model.updatedBy;
    if (model.lesson) {
      dto.lesson_id = model.lesson.id;
    }

    if (model.practice) {
      dto.practice_id = model.practice.id;
    }

    dto.answers =
      model.answers?.map((answer) => AnswerMapper.toDto(answer)) ?? [];

    return dto;
  }
}
