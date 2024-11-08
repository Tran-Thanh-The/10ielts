import { PracticeExercise } from "../../../../domain/practice-exercise";
import { PracticeExerciseEntity } from "../entities/practice-exercise.entity";

export class PracticeExerciseMapper {
  static toDomain(raw: PracticeExerciseEntity): PracticeExercise {
    const domainEntity = new PracticeExercise();
    domainEntity.price = raw.price;
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: PracticeExercise): PracticeExerciseEntity {
    const persistenceEntity = new PracticeExerciseEntity();
    persistenceEntity.price = domainEntity.price;
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
