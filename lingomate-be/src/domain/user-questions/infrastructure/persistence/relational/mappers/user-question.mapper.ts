import { UserQuestion } from "@/domain/user-questions/domain/user-question";
import { UserQuestionEntity } from "../entities/user-question.entity";
import { CreateUserQuestionDto } from "@/domain/user-questions/dto/create-user-question.dto";
import { UserEntity } from "@/domain/users/infrastructure/persistence/relational/entities/user.entity";
import { QuestionEntity } from "@/domain/questions/infrastructure/persistence/relational/entities/question.entity";

export class UserQuestionMapper {
  static toDomain(raw: UserQuestionEntity): UserQuestion {
    const domainEntity = new UserQuestion();
    domainEntity.id = raw.id;
    domainEntity.user = raw.user;
    domainEntity.question = raw.question;
    if (raw.answerPick) {
      domainEntity.answerPick = raw.answerPick;
    }
    domainEntity.status = raw.status;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: UserQuestion): UserQuestionEntity {
    const persistenceEntity = new UserQuestionEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.user = domainEntity.user;
    persistenceEntity.question = domainEntity.question;
    persistenceEntity.answerPick = domainEntity.answerPick;
    persistenceEntity.status = domainEntity.status;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }

  public static toModel(dto: CreateUserQuestionDto): UserQuestion {
    const model = new UserQuestion();
    if (dto.user_id) {
      const user = new UserEntity();
      user.id = dto.user_id;
      model.user = user;
    }

    if (dto.question_id) {
      const question = new QuestionEntity();
      question.id = dto.question_id;
      model.question = question;
    }
    if (dto.answerPick) {
      model.answerPick = dto.answerPick;
    }
    return model;
  }
}
