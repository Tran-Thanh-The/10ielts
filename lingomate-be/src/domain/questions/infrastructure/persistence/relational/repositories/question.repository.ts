import { StatusEnum } from "@/common/enums/status.enum";
import { NullableType } from "@/utils/types/nullable.type";
import { IPaginationOptions } from "@/utils/types/pagination-options";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Question } from "../../../../domain/question";
import { QuestionRepository } from "../../question.repository";
import { QuestionEntity } from "../entities/question.entity";
import { QuestionMapper } from "../mappers/question.mapper";

@Injectable()
export class QuestionRelationalRepository implements QuestionRepository {
  constructor(
    @InjectRepository(QuestionEntity)
    private readonly questionRepository: Repository<QuestionEntity>,
  ) {}

  async create(data: Question): Promise<Question> {
    const persistenceModel = QuestionMapper.toPersistence(data);
    const newEntity = await this.questionRepository.save(
      this.questionRepository.create(persistenceModel),
    );
    return QuestionMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Question[]> {
    const entities = await this.questionRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      relations: ["answers", "file"],
      order: {
        createdAt: "DESC",
      },
    });

    return entities.map((entity) => QuestionMapper.toDomain(entity));
  }

  async findById(id: Question["id"]): Promise<NullableType<Question>> {
    const entity = await this.questionRepository.findOne({
      where: { id },
      relations: ["answers", "lesson"],
    });

    return entity ? QuestionMapper.toDomain(entity) : null;
  }

  async countActiveQuestionsByLessonId(lessonId: string): Promise<number> {
    return this.questionRepository.count({
      where: {
        lesson: { id: lessonId },
        status: StatusEnum.ACTIVE,
      },
    });
  }

  async findActiveQuestionsByLessonId(lessonId: string): Promise<Question[]> {
    return this.questionRepository.find({
      where: {
        lesson: { id: lessonId },
        status: StatusEnum.ACTIVE,
      },
      relations: ["lesson"],
    });
  }

  async update(
    id: Question["id"],
    payload: Partial<Question>,
  ): Promise<Question> {
    const entity = await this.questionRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error("Record not found");
    }

    const updatedEntity = await this.questionRepository.save(
      this.questionRepository.create(
        QuestionMapper.toPersistence({
          ...QuestionMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return QuestionMapper.toDomain(updatedEntity);
  }

  async remove(id: Question["id"]): Promise<void> {
    await this.questionRepository.delete(id);
  }

  async save(question: Question): Promise<void> {
    if (!question || !question.id) {
      throw new NotFoundException("question not found");
    }
    await this.questionRepository.save(question);
  }
}
