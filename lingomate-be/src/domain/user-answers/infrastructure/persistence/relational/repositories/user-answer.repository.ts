import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserAnswerEntity } from "../entities/user-answer.entity";
import { NullableType } from "@/utils/types/nullable.type";
import { UserAnswer } from "@/domain/user-answers/domain/user-answer";
import { UserAnswerRepository } from "../../user-answer.repository";
import { UserAnswerMapper } from "../mappers/user-answer.mapper";
import { IPaginationOptions } from "@/utils/types/pagination-options";

@Injectable()
export class UserAnswerRelationalRepository implements UserAnswerRepository {
  constructor(
    @InjectRepository(UserAnswerEntity)
    private readonly userAnswerRepository: Repository<UserAnswerEntity>,
  ) {}

  async create(data: UserAnswer): Promise<UserAnswer> {
    const persistenceModel = UserAnswerMapper.toPersistence(data);
    const newEntity = await this.userAnswerRepository.save(
      this.userAnswerRepository.create(persistenceModel),
    );
    return UserAnswerMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<UserAnswer[]> {
    const entities = await this.userAnswerRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => UserAnswerMapper.toDomain(entity));
  }

  async findById(id: UserAnswer["id"]): Promise<NullableType<UserAnswer>> {
    const entity = await this.userAnswerRepository.findOne({
      where: { id },
    });

    return entity ? UserAnswerMapper.toDomain(entity) : null;
  }

  async update(
    id: UserAnswer["id"],
    payload: Partial<UserAnswer>,
  ): Promise<UserAnswer> {
    const entity = await this.userAnswerRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error("Record not found");
    }

    const updatedEntity = await this.userAnswerRepository.save(
      this.userAnswerRepository.create(
        UserAnswerMapper.toPersistence({
          ...UserAnswerMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return UserAnswerMapper.toDomain(updatedEntity);
  }

  async remove(id: UserAnswer["id"]): Promise<void> {
    await this.userAnswerRepository.delete(id);
  }
}
