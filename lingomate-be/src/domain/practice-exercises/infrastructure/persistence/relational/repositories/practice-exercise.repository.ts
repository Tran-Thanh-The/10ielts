import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PracticeExerciseEntity } from "../entities/practice-exercise.entity";
import { NullableType } from "@/utils/types/nullable.type";
import { PracticeExercise } from "../../../../domain/practice-exercise";
import { PracticeExerciseRepository } from "../../practice-exercise.repository";
import { PracticeExerciseMapper } from "../mappers/practice-exercise.mapper";
import { IPaginationOptions } from "@/utils/types/pagination-options";

@Injectable()
export class PracticeExerciseRelationalRepository
  implements PracticeExerciseRepository
{
  constructor(
    @InjectRepository(PracticeExerciseEntity)
    private readonly practiceExerciseRepository: Repository<PracticeExerciseEntity>,
  ) {}

  async create(data: PracticeExercise): Promise<PracticeExercise> {
    const persistenceModel = PracticeExerciseMapper.toPersistence(data);
    const newEntity = await this.practiceExerciseRepository.save(
      this.practiceExerciseRepository.create(persistenceModel),
    );
    return PracticeExerciseMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<PracticeExercise[]> {
    const entities = await this.practiceExerciseRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      relations: ["questions", "questions.answers"],
      order: {
        createdAt: "DESC",
      },
    });

    return entities.map((entity) => PracticeExerciseMapper.toDomain(entity));
  }

  async findById(
    id: PracticeExercise["id"],
  ): Promise<NullableType<PracticeExercise>> {
    const entity = await this.practiceExerciseRepository.findOne({
      where: { id },
    });

    return entity ? PracticeExerciseMapper.toDomain(entity) : null;
  }

  async update(
    id: PracticeExercise["id"],
    payload: Partial<PracticeExercise>,
  ): Promise<PracticeExercise> {
    const entity = await this.practiceExerciseRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error("Record not found");
    }

    const updatedEntity = await this.practiceExerciseRepository.save(
      this.practiceExerciseRepository.create(
        PracticeExerciseMapper.toPersistence({
          ...PracticeExerciseMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return PracticeExerciseMapper.toDomain(updatedEntity);
  }

  async remove(id: PracticeExercise["id"]): Promise<void> {
    await this.practiceExerciseRepository.delete(id);
  }
}
