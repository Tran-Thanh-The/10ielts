import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConversationEntity } from "../entities/conversation.entity";
import { NullableType } from "@/utils/types/nullable.type";
import { Conversation } from "@/domain/conversations/domain/conversation";
import { ConversationRepository } from "../../conversation.repository";
import { ConversationMapper } from "../mappers/conversation.mapper";
import { IPaginationOptions } from "@/utils/types/pagination-options";

@Injectable()
export class ConversationRelationalRepository
  implements ConversationRepository
{
  constructor(
    @InjectRepository(ConversationEntity)
    private readonly conversationRepository: Repository<ConversationEntity>,
  ) {}

  async create(data: Conversation): Promise<Conversation> {
    const persistenceModel = ConversationMapper.toPersistence(data);
    const newEntity = await this.conversationRepository.save(
      this.conversationRepository.create(persistenceModel),
    );
    return ConversationMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Conversation[]> {
    const entities = await this.conversationRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => ConversationMapper.toDomain(entity));
  }

  async findById(id: Conversation["id"]): Promise<NullableType<Conversation>> {
    const entity = await this.conversationRepository.findOne({
      where: { id },
    });

    return entity ? ConversationMapper.toDomain(entity) : null;
  }

  async update(
    id: Conversation["id"],
    payload: Partial<Conversation>,
  ): Promise<Conversation> {
    const entity = await this.conversationRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error("Record not found");
    }

    const updatedEntity = await this.conversationRepository.save(
      this.conversationRepository.create(
        ConversationMapper.toPersistence({
          ...ConversationMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return ConversationMapper.toDomain(updatedEntity);
  }

  async remove(id: Conversation["id"]): Promise<void> {
    await this.conversationRepository.delete(id);
  }
}
