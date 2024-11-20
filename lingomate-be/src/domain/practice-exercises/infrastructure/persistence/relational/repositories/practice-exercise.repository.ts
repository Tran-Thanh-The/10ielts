import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PracticeExerciseEntity } from "../entities/practice-exercise.entity";
import { NullableType } from "@/utils/types/nullable.type";
import { PracticeExercise } from "../../../../domain/practice-exercise";
import { PracticeExerciseRepository } from "../../practice-exercise.repository";
import { PracticeExerciseMapper } from "../mappers/practice-exercise.mapper";
import { IPaginationOptions } from "@/utils/types/pagination-options";
import { StatusEnum } from "@/common/enums/status.enum";

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

  async getPracticeExerciseDetail(
    id: PracticeExercise["id"],
    {
      page,
      limit,
      order,
      status,
    }: IPaginationOptions & { order: "ASC" | "DESC"; status?: StatusEnum },
  ): Promise<NullableType<PracticeExercise>> {
    const queryBuilder = this.practiceExerciseRepository
      .createQueryBuilder("practiceExercise")
      .leftJoinAndSelect("practiceExercise.user", "user")
      .leftJoinAndSelect("practiceExercise.answerHistory", "answerHistory")
      .leftJoinAndSelect("practiceExercise.invoiceProducts", "invoiceProducts")
      .leftJoinAndSelect("practiceExercise.questions", "question")
      .leftJoinAndSelect("question.answers", "answer")
      .where("practiceExercise.id = :id", { id })
      .orderBy("question.position", order)
      .skip((page - 1) * limit)
      .take(limit);

    if (status) {
      queryBuilder.andWhere("question.status = :status", { status });
    }

    queryBuilder
      .orderBy("question.position", order)
      .addOrderBy("answer.position", order);

    const entity = await queryBuilder.getOne();
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
