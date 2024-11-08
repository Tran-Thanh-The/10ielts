import { DeepPartial } from "@/utils/types/deep-partial.type";
import { NullableType } from "@/utils/types/nullable.type";
import { IPaginationOptions } from "@/utils/types/pagination-options";
import { AnswerHistory } from "../../domain/answer-history";

export abstract class AnswerHistoryRepository {
  abstract create(
    data: Omit<AnswerHistory, "id" | "createdAt" | "updatedAt">,
  ): Promise<AnswerHistory>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<AnswerHistory[]>;

  abstract findById(
    id: AnswerHistory["id"],
  ): Promise<NullableType<AnswerHistory>>;

  abstract update(
    id: AnswerHistory["id"],
    payload: DeepPartial<AnswerHistory>,
  ): Promise<AnswerHistory | null>;

  abstract remove(id: AnswerHistory["id"]): Promise<void>;
}
