import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserConversationEntity } from "../entities/user-conversation.entity";
import { NullableType } from "@/utils/types/nullable.type";
import { UserConversation } from "@/domain/user-conversations/domain/user-conversation";
import { UserConversationRepository } from "../../user-conversation.repository";
import { UserConversationMapper } from "../mappers/user-conversation.mapper";
import { IPaginationOptions } from "@/utils/types/pagination-options";

@Injectable()
export class UserConversationRelationalRepository
  implements UserConversationRepository
{
  constructor(
    @InjectRepository(UserConversationEntity)
    private readonly userConversationRepository: Repository<UserConversationEntity>,
  ) {}

  async create(data: UserConversation): Promise<UserConversation> {
    const persistenceModel = UserConversationMapper.toPersistence(data);
    const newEntity = await this.userConversationRepository.save(
      this.userConversationRepository.create(persistenceModel),
    );
    return UserConversationMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<UserConversation[]> {
    const entities = await this.userConversationRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => UserConversationMapper.toDomain(entity));
  }

  async findById(
    id: UserConversation["id"],
  ): Promise<NullableType<UserConversation>> {
    const entity = await this.userConversationRepository.findOne({
      where: { id },
    });

    return entity ? UserConversationMapper.toDomain(entity) : null;
  }

  async update(
    id: UserConversation["id"],
    payload: Partial<UserConversation>,
  ): Promise<UserConversation> {
    const entity = await this.userConversationRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error("Record not found");
    }

    const updatedEntity = await this.userConversationRepository.save(
      this.userConversationRepository.create(
        UserConversationMapper.toPersistence({
          ...UserConversationMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return UserConversationMapper.toDomain(updatedEntity);
  }

  async remove(id: UserConversation["id"]): Promise<void> {
    await this.userConversationRepository.delete(id);
  }

  async findOneBy(
    query: Partial<UserConversation>,
  ): Promise<NullableType<UserConversation>> {
    const entity = await this.userConversationRepository.findOne({
      where: query,
    });

    return entity ? UserConversationMapper.toDomain(entity) : null;
  }

  async checkExistence(query: Partial<UserConversation>): Promise<boolean> {
    const entity = await this.userConversationRepository.exists({
      where: query,
    });

    return entity;
  }
}
