import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserLessonEntity } from "../entities/user-lesson.entity";
import { NullableType } from "@/utils/types/nullable.type";
import { UserLesson } from "@/domain/user-lessons/domain/user-lesson";
import { UserLessonRepository } from "../../user-lesson.repository";
import { UserLessonMapper } from "../mappers/user-lesson.mapper";
import { IPaginationOptions } from "@/utils/types/pagination-options";

@Injectable()
export class UserLessonRelationalRepository implements UserLessonRepository {
  constructor(
    @InjectRepository(UserLessonEntity)
    private readonly userLessonRepository: Repository<UserLessonEntity>,
  ) {}

  async create(data: UserLesson): Promise<UserLesson> {
    const persistenceModel = UserLessonMapper.toPersistence(data);
    const newEntity = await this.userLessonRepository.save(
      this.userLessonRepository.create(persistenceModel),
    );
    return UserLessonMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<UserLesson[]> {
    const entities = await this.userLessonRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => UserLessonMapper.toDomain(entity));
  }

  async findById(id: UserLesson["id"]): Promise<NullableType<UserLesson>> {
    const entity = await this.userLessonRepository.findOne({
      where: { id },
    });

    return entity ? UserLessonMapper.toDomain(entity) : null;
  }

  async findAllByUserId(userId: string): Promise<NullableType<UserLesson[]>> {
    return await this.userLessonRepository
      .createQueryBuilder("userLesson")
      .leftJoinAndSelect("userLesson.user", "user")
      .leftJoinAndSelect("userLesson.lesson", "lesson")
      .where("user.id = :userId", { userId })
      .getMany();
  }

  async update(
    id: UserLesson["id"],
    payload: Partial<UserLesson>,
  ): Promise<UserLesson> {
    const entity = await this.userLessonRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error("Record not found");
    }

    const updatedEntity = await this.userLessonRepository.save(
      this.userLessonRepository.create(
        UserLessonMapper.toPersistence({
          ...UserLessonMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return UserLessonMapper.toDomain(updatedEntity);
  }

  async remove(id: UserLesson["id"]): Promise<void> {
    await this.userLessonRepository.delete(id);
  }
}
