import { StatusEnum } from "@/common/enums/status.enum";
import { AnswerMapper } from "@/domain/answers/infrastructure/persistence/relational/mappers/answer.mapper";
import { CreatePracticeExerciseDto } from "@/domain/practice-exercises/dto/create-practice-exercise.dto";
import { PracticeResponseDto } from "@/domain/practice-exercises/dto/response-practice-exercise.dto";
import { QuestionMapper } from "@/domain/questions/infrastructure/persistence/relational/mappers/question.mapper";
import { UserEntity } from "@/domain/users/infrastructure/persistence/relational/entities/user.entity";
import { PracticeExercise } from "../../../../domain/practice-exercise";
import { PracticeExerciseEntity } from "../entities/practice-exercise.entity";

export class PracticeExerciseMapper {
  static toDomain(raw: PracticeExerciseEntity): PracticeExercise {
    const domainEntity = new PracticeExercise();
    domainEntity.price = raw.price;
    domainEntity.id = raw.id;
    domainEntity.user = raw.user;
    domainEntity.title = raw.title;
    domainEntity.content = raw.content;
    domainEntity.description = raw.description;
    domainEntity.price = raw.price;
    domainEntity.practiceType = raw.practiceType;
    domainEntity.difficulty = raw.difficulty;
    domainEntity.status = raw.status;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    if (raw.questions) {
      domainEntity.questions = raw.questions.map((question) => {
        const questionDomain = QuestionMapper.toDomain(question);
        questionDomain.answers = question.answers
          ? question.answers.map((answer) => {
              const answerDomain = AnswerMapper.toDomain(answer);
              delete answerDomain.question;
              return answerDomain;
            })
          : [];

        return questionDomain;
      });
    }

    return domainEntity;
  }

  static toPersistence(domainEntity: PracticeExercise): PracticeExerciseEntity {
    const persistenceEntity = new PracticeExerciseEntity();
    persistenceEntity.price = domainEntity.price;
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.user = domainEntity.user;
    persistenceEntity.title = domainEntity.title;
    persistenceEntity.content = domainEntity.content;
    persistenceEntity.description = domainEntity.description;
    persistenceEntity.price = domainEntity.price;
    persistenceEntity.practiceType = domainEntity.practiceType;
    persistenceEntity.difficulty = domainEntity.difficulty;
    persistenceEntity.status = domainEntity.status;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;
    if (domainEntity.questions) {
      persistenceEntity.questions = domainEntity.questions.map((question) =>
        QuestionMapper.toPersistence(question),
      );
    } else {
      persistenceEntity.questions = [];
    }

    return persistenceEntity;
  }

  static toModel(dto: CreatePracticeExerciseDto): PracticeExercise {
    const model = new PracticeExercise();
    if (dto.user_id) {
      const user = new UserEntity();
      user.id = dto.user_id;
      model.user = user;
    }
    model.title = dto.title;
    model.content = dto.content;
    model.description = dto.description;
    model.price = dto.price;
    model.practiceType = dto.practiceType;
    model.difficulty = dto.difficulty;
    model.status = dto.status ?? StatusEnum.IN_ACTIVE;
    return model;
  }

  static toDto(model: PracticeExercise): PracticeResponseDto {
    const dto = new PracticeResponseDto();
    dto.id = model.id;
    dto.title = model.title;
    dto.content = model.content;
    dto.description = model.description;
    dto.price = model.price;
    dto.practiceType = model.practiceType;
    dto.difficulty = model.difficulty;
    dto.status = model.status;
    dto.createdAt = model.createdAt;
    dto.updatedAt = model.updatedAt;
    dto.questions = model.questions
      ? model.questions.map((question) => {
          const questionDto = QuestionMapper.toDto(question);
          questionDto.answers = question.answers
            ? question.answers.map((answer) => AnswerMapper.toDto(answer))
            : [];
          return questionDto;
        })
      : [];
    return dto;
  }
}
