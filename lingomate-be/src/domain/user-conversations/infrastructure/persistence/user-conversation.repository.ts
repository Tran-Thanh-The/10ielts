import { DeepPartial } from "@/utils/types/deep-partial.type";
import { NullableType } from "@/utils/types/nullable.type";
import { IPaginationOptions } from "@/utils/types/pagination-options";
import { UserConversation } from "../../domain/user-conversation";

export abstract class UserConversationRepository {
  abstract create(
    data: Omit<UserConversation, "id" | "createdAt" | "updatedAt">,
  ): Promise<UserConversation>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<UserConversation[]>;

  abstract findById(
    id: UserConversation["id"],
  ): Promise<NullableType<UserConversation>>;

  abstract update(
    id: UserConversation["id"],
    payload: DeepPartial<UserConversation>,
  ): Promise<UserConversation | null>;

  abstract remove(id: UserConversation["id"]): Promise<void>;

  abstract findOneBy(
    query: Partial<UserConversation>,
  ): Promise<NullableType<UserConversation>>;

  abstract checkExistence(query: Partial<UserConversation>): Promise<boolean>;
}
