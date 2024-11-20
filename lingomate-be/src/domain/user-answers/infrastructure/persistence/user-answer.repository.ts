import { DeepPartial } from "@/utils/types/deep-partial.type";
import { NullableType } from "@/utils/types/nullable.type";
import { IPaginationOptions } from "@/utils/types/pagination-options";
import { UserAnswer } from "../../domain/user-answer";

export abstract class UserAnswerRepository {
  abstract create(
    data: Omit<UserAnswer, "id" | "createdAt" | "updatedAt">,
  ): Promise<UserAnswer>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<UserAnswer[]>;

  abstract findById(id: UserAnswer["id"]): Promise<NullableType<UserAnswer>>;

  abstract update(
    id: UserAnswer["id"],
    payload: DeepPartial<UserAnswer>,
  ): Promise<UserAnswer | null>;

  abstract remove(id: UserAnswer["id"]): Promise<void>;
}
