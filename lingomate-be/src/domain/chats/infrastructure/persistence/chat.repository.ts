import { DeepPartial } from "@/utils/types/deep-partial.type";
import { NullableType } from "@/utils/types/nullable.type";
import { IPaginationOptions } from "@/utils/types/pagination-options";
import { Chat } from "../../domain/chat";

export abstract class ChatRepository {
  abstract create(
    data: Omit<Chat, "id" | "createdAt" | "updatedAt">,
  ): Promise<Chat>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Chat[]>;

  abstract findById(id: Chat["id"]): Promise<NullableType<Chat>>;

  abstract update(
    id: Chat["id"],
    payload: DeepPartial<Chat>,
  ): Promise<Chat | null>;

  abstract remove(id: Chat["id"]): Promise<void>;
}
