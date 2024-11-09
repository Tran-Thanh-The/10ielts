import { NullableType } from "@/utils/types/nullable.type";
import { IPaginationOptions } from "@/utils/types/pagination-options";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LessonRepository } from "../../lesson.repository";
import { LessonEntity } from "../entities/lesson.entity";
import { LessonMapper } from "../mappers/lesson.mapper";
import { Lesson } from "./../../../../domain/lesson";
import { StatusEnum } from "@/common/enums/status.enum";

@Injectable()
export class LessonRelationalRepository implements LessonRepository {
  constructor(
    @InjectRepository(LessonEntity)
    private readonly lessonRepository: Repository<LessonEntity>,
  ) {}
  async create(data: Lesson): Promise<Lesson> {
    const persistenceModel = LessonMapper.toPersistence(data);
    const newEntity = await this.lessonRepository.save(
      this.lessonRepository.create(persistenceModel),
    );
    return LessonMapper.toDomain(newEntity);
  }

  async findAll(): Promise<Lesson[]> {
    const entities = await this.lessonRepository.find({
      relations: ["questions", "questions.answers", "file"],
    });
    return entities.map((entity) => LessonMapper.toDomain(entity));
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Lesson[]> {
    const { page, limit } = paginationOptions;
    const entities = await this.lessonRepository.find({
      skip: (page - 1) * limit,
      take: limit,
      relations: ["questions", "questions.answers", "file"],
      order: {
        createdAt: "DESC",
      },
    });

    return entities.map((entity) => LessonMapper.toDomain(entity));
  }

  async findAllWithPaginationAndCourseId({
    courseId,
    paginationOptions,
  }: {
    courseId: string;
    paginationOptions: IPaginationOptions;
  }): Promise<Lesson[]> {
    const { page, limit } = paginationOptions;
  
    const entities = await this.lessonRepository
      .createQueryBuilder("lesson")
      .innerJoinAndSelect(
        "lesson.lessonCourses",
        "lessonCourse",
        "lessonCourse.courseId = :courseId",
        { courseId },
      )
      .leftJoinAndSelect("lesson.file", "file")
      .leftJoinAndSelect("lesson.questions", "question")
      .leftJoinAndSelect("question.answers", "answer")
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy("lessonCourse.position", "ASC")
      .getMany();
  
    return entities.map((entity) => LessonMapper.toDomain(entity));
  }
  

  async getLessonDetail(
    id: Lesson["id"],
    {
      page,
      limit,
      order,
      status,
    }: IPaginationOptions & { order: "ASC" | "DESC"; status?: StatusEnum },
  ): Promise<NullableType<Lesson>> {
    const queryBuilder = this.lessonRepository
      .createQueryBuilder("lesson")
      .leftJoinAndSelect("lesson.file", "file")
      .leftJoinAndSelect("lesson.questions", "question")
      .leftJoinAndSelect("question.answers", "answer")
      .where("lesson.id = :id", { id })
      .orderBy("question.position", order)
      .skip((page - 1) * limit)
      .take(limit);

    if (status) {
      queryBuilder.andWhere("question.status = :status", { status });
    }

    const entity = await queryBuilder.getOne();
    return entity ? LessonMapper.toDomain(entity) : null;
  }

  // async getLessonDetail(
  //   id: Lesson["id"],
  //   {
  //     page,
  //     limit,
  //     order,
  //     status,
  //   }: IPaginationOptions & { order: "ASC" | "DESC"; status?: StatusEnum; courseId?: string },
  // ): Promise<NullableType<Lesson>> {
  //   const queryBuilder = this.lessonRepository
  //     .createQueryBuilder("lesson")
  //     .leftJoinAndSelect("lesson.file", "file")
  //     .leftJoinAndSelect("lesson.lessonCourses", "lessonCourse")
  //     .addSelect("lessonCourse.position")
  //     .leftJoinAndSelect("lesson.questions", "question") 
  //     .leftJoinAndSelect("question.answers", "answer")
  //     .where("lesson.id = :id", { id })
  //     .orderBy("question.position", order)
  //     .skip((page - 1) * limit)
  //     .take(limit);

  //   if (courseId) {
  //     queryBuilder.andWhere("lessonCourse.courseId = :courseId", { courseId });
  //   }

  //   if (status) {
  //     queryBuilder.andWhere("question.status = :status", { status });
  //   }

  //   const entity = await queryBuilder.getOne();
  //   return entity ? LessonMapper.toDomain(entity) : null;
  // }

  async findById(id: Lesson["id"]): Promise<NullableType<Lesson>> {
    const entity = await this.lessonRepository.findOne({
      where: { id },
      relations: ["questions", "questions.answers"],
    });

    return entity ? LessonMapper.toDomain(entity) : null;
  }

  async findByQuestionId(questionId: string): Promise<NullableType<Lesson>> {
    return await this.lessonRepository
      .createQueryBuilder("lesson")
      .leftJoinAndSelect("lesson.questions", "question")
      .where("question.id = :questionId", { questionId })
      .getOne();
  }

  async findByTitle(title: Lesson["title"]): Promise<NullableType<Lesson>> {
    const entity = await this.lessonRepository.findOne({
      where: { title },
    });

    return entity ? LessonMapper.toDomain(entity) : null;
  }

  async update(id: Lesson["id"], payload: Partial<Lesson>): Promise<Lesson> {
    const entity = await this.lessonRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error("Record not found");
    }

    const updatedEntity = await this.lessonRepository.save(
      this.lessonRepository.create(
        LessonMapper.toPersistence({
          ...LessonMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return LessonMapper.toDomain(updatedEntity);
  }

  async remove(id: Lesson["id"]): Promise<void> {
    await this.lessonRepository.delete(id);
  }

  async save(lesson: Lesson): Promise<void> {
    if (!lesson || !lesson.id) {
      throw new NotFoundException("Lesson not found");
    }
    await this.lessonRepository.save(lesson);
  }
}
