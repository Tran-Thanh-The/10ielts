import { AnswerHistory } from "@/domain/answer-histories/domain/answer-history";
import { NullableType } from "@/utils/types/nullable.type";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  AnswerHistoryRepository,
  FindAnswerHistoryOptions,
} from "../../answer-history.repository";
import { AnswerHistoryEntity } from "../entities/answer-history.entity";
import { AnswerHistoryMapper } from "../mappers/answer-history.mapper";

@Injectable()
export class AnswerHistoryRelationalRepository
  implements AnswerHistoryRepository
{
  constructor(
    @InjectRepository(AnswerHistoryEntity)
    private readonly answerHistoryRepository: Repository<AnswerHistoryEntity>,
  ) {}

  async save(answerHistory: AnswerHistory): Promise<void> {
    if (!answerHistory || !answerHistory.id) {
      throw new NotFoundException("answerHistory not found");
    }
    await this.answerHistoryRepository.save(answerHistory);
  }

  async create(data: AnswerHistory): Promise<AnswerHistory> {
    const persistenceModel = AnswerHistoryMapper.toPersistence(data);
    const newEntity = await this.answerHistoryRepository.save(
      this.answerHistoryRepository.create(persistenceModel),
    );

    return AnswerHistoryMapper.toDomain(newEntity);
  }

  // async findAllWithPagination({
  //   paginationOptions,
  // }: {
  //   paginationOptions: IPaginationOptions;
  // }): Promise<AnswerHistory[]> {
  //   const entities = await this.answerHistoryRepository.find({
  //     skip: (paginationOptions.page - 1) * paginationOptions.limit,
  //     take: paginationOptions.limit,
  //     relations: ["practice", "lesson"],
  //     order: {
  //       createdAt: "DESC",
  //     },
  //   });

  //   return entities.map((entity) => AnswerHistoryMapper.toDomain(entity));
  // }

  async findAllWithPagination({
    paginationOptions,
    practiceId,
    lessonId,
    userId,
  }: FindAnswerHistoryOptions): Promise<AnswerHistory[]> {
    const queryBuilder = this.answerHistoryRepository
      .createQueryBuilder("answerHistory")
      .leftJoinAndSelect("answerHistory.practice", "practice")
      .leftJoinAndSelect("answerHistory.lesson", "lesson")
      .leftJoinAndSelect("answerHistory.user", "user")
      .leftJoinAndSelect("answerHistory.audioAnswer", "file");

    if (practiceId) {
      queryBuilder.andWhere("practice.id = :practiceId", { practiceId });
    }

    if (lessonId) {
      queryBuilder.andWhere("lesson.id = :lessonId", { lessonId });
    }

    if (userId) {
      queryBuilder.andWhere("user.id = :userId", { userId });
    }

    const [entities] = await queryBuilder
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .take(paginationOptions.limit)
      .orderBy("answerHistory.createdAt", "DESC")
      .getManyAndCount();

    return entities.map((entity) => AnswerHistoryMapper.toDomain(entity));
  }

  async findById(
    id: AnswerHistory["id"],
  ): Promise<NullableType<AnswerHistory>> {
    const entity = await this.answerHistoryRepository.findOne({
      where: { id },
      relations: [
        "practice",
        "lesson",
        "practice.questions",
        "practice.questions.file",
        "practice.questions.answers",
        "practice.questions.answers.file",
        "lesson.questions",
        "lesson.questions.file",
        "lesson.questions.answers",
        "lesson.questions.answers.file",
      ],
    });

    return entity ? AnswerHistoryMapper.toDomain(entity) : null;
  }

  async update(
    id: AnswerHistory["id"],
    payload: Partial<AnswerHistory>,
  ): Promise<AnswerHistory> {
    const entity = await this.answerHistoryRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error("Record not found");
    }

    const updatedEntity = await this.answerHistoryRepository.save(
      this.answerHistoryRepository.create(
        AnswerHistoryMapper.toPersistence({
          ...AnswerHistoryMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return AnswerHistoryMapper.toDomain(updatedEntity);
  }

  async remove(id: AnswerHistory["id"]): Promise<void> {
    await this.answerHistoryRepository.delete(id);
  }
}
