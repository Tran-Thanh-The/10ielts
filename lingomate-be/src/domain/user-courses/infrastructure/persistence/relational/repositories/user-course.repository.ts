import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserCourseEntity } from "../entities/user-course.entity";
import { NullableType } from "@/utils/types/nullable.type";
import { UserCourse } from "@/domain/user-courses/domain/user-course";
import { UserCourseRepository } from "../../user-course.repository";
import { UserCourseMapper } from "../mappers/user-course.mapper";
import { IPaginationOptions } from "@/utils/types/pagination-options";

@Injectable()
export class UserCourseRelationalRepository implements UserCourseRepository {
  constructor(
    @InjectRepository(UserCourseEntity)
    private readonly userCourseRepository: Repository<UserCourseEntity>,
  ) {}

  async save(userCourse: UserCourse): Promise<void> {
    if (!userCourse || !userCourse.id) {
      throw new NotFoundException("User Course not found");
    }
    const entity = UserCourseMapper.toPersistence(userCourse);
    await this.userCourseRepository.save(entity);
  }

  async create(data: UserCourse): Promise<UserCourse> {
    const persistenceModel = UserCourseMapper.toPersistence(data);
    const newEntity = await this.userCourseRepository.save(
      this.userCourseRepository.create(persistenceModel),
    );
    return UserCourseMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<UserCourse[]> {
    const entities = await this.userCourseRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => UserCourseMapper.toDomain(entity));
  }

  async findById(id: UserCourse["id"]): Promise<NullableType<UserCourse>> {
    const entity = await this.userCourseRepository.findOne({
      where: { id },
    });

    return entity ? UserCourseMapper.toDomain(entity) : null;
  }
  async findByCourseId(course_id: string): Promise<NullableType<UserCourse[]>> {
    const userCourses = await this.userCourseRepository
      .createQueryBuilder("userCourse")
      .leftJoinAndSelect("userCourse.course", "course")
      .where("course.id = :course_id", { course_id })
      .getMany();

    return userCourses.length
      ? userCourses.map(UserCourseMapper.toDomain)
      : null;
  }

  async update(
    id: UserCourse["id"],
    payload: Partial<UserCourse>,
  ): Promise<UserCourse> {
    const entity = await this.userCourseRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error("Record not found");
    }

    const updatedEntity = await this.userCourseRepository.save(
      this.userCourseRepository.create(
        UserCourseMapper.toPersistence({
          ...UserCourseMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return UserCourseMapper.toDomain(updatedEntity);
  }

  async remove(id: UserCourse["id"]): Promise<void> {
    await this.userCourseRepository.delete(id);
  }
}
