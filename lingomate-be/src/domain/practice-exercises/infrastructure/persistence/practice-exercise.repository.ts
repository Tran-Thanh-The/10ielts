import { DeepPartial } from "@/utils/types/deep-partial.type";
import { NullableType } from "@/utils/types/nullable.type";
import { IPaginationOptions } from "@/utils/types/pagination-options";
import { PracticeExercise } from "../../domain/practice-exercise";
import { StatusEnum } from "@/common/enums/status.enum";

export abstract class PracticeExerciseRepository {
  abstract create(
    data: Omit<PracticeExercise, "id" | "createdAt" | "updatedAt">,
  ): Promise<PracticeExercise>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<PracticeExercise[]>;

  abstract findById(
    id: PracticeExercise["id"],
  ): Promise<NullableType<PracticeExercise>>;

  abstract getPracticeExerciseDetail(
    id: PracticeExercise["id"],
    paginationOptions: IPaginationOptions & {
      order: "ASC" | "DESC";
      status?: StatusEnum;
    },
  ): Promise<NullableType<PracticeExercise>>;

  abstract update(
    id: PracticeExercise["id"],
    payload: DeepPartial<PracticeExercise>,
  ): Promise<PracticeExercise | null>;

  abstract remove(id: PracticeExercise["id"]): Promise<void>;
}
