import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, Repository } from "typeorm";
import { ConversationEntity } from "../entities/conversation.entity";
import { NullableType } from "@/utils/types/nullable.type";
import { Conversation } from "@/domain/conversations/domain/conversation";
import { ConversationRepository } from "../../conversation.repository";
import { ConversationMapper } from "../mappers/conversation.mapper";
import { IPaginationOptions } from "@/utils/types/pagination-options";
// import { FindOptionsWhere } from "typeorm/find-options/FindOptionsWhere";

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

  async findAllWithSearchAndPagination(
    options?: FindManyOptions<ConversationEntity>,
  ): Promise<{
    result: Conversation[];
    total: number;
  }> {
    const [result, total] =
      await this.conversationRepository.findAndCount(options);

    return {
      result: result.map((entity) => ConversationMapper.toDomain(entity)),
      total,
    };
  }

  async checkReadPermission(userId, id): Promise<boolean> {
    const result = await this.conversationRepository.query(
      `
        SELECT EXISTS (
          SELECT 1
          FROM "conversation" c
          JOIN "user" u ON c."from"::int = u."id" OR c."to"::int = u."id"
          WHERE u."id" = $1 AND c."id" = $2
        )
      `,
      [userId, id],
    );
    return result[0].exists;
  }

  async findConversationOfUser(
    userId: number | string,
  ): Promise<ConversationEntity & { latestMessage: string }> {
    const result = await this.conversationRepository.query(
      `
        SELECT
            c.*,
            json_build_object(
                'id', ch.id,
                'message', ch.message,
                'createdAt', ch."createdAt",
                'from', ch."userId"
            ) AS "latestMessage"
        FROM conversation c
        JOIN user_conversation uc ON uc."conversationId" = c.id
        LEFT JOIN LATERAL (
            SELECT ch.id, ch.message, ch."createdAt", ch."userId"
            FROM chat ch
            WHERE ch."conversationId" = c.id
            ORDER BY ch."createdAt" DESC
            LIMIT 1
        ) ch ON true
        WHERE uc."userId" = $1
            AND c."conversationType" = $2
        GROUP BY c.id, ch.id, ch.message, ch."createdAt", ch."userId";
      `,
      [userId, "PRIVATE"],
    );
    return result[0];
  }
}
