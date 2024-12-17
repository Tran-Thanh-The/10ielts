import { DeepPartial } from "@/utils/types/deep-partial.type";
import { NullableType } from "@/utils/types/nullable.type";
import { IPaginationOptions } from "@/utils/types/pagination-options";
import { UserLesson } from "../../domain/user-lesson";

export abstract class UserLessonRepository {
  abstract create(
    data: Omit<UserLesson, "id" | "createdAt" | "updatedAt">,
  ): Promise<UserLesson>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<UserLesson[]>;

  abstract findById(id: UserLesson["id"]): Promise<NullableType<UserLesson>>;

  abstract findAllByUserId(userId: string): Promise<NullableType<UserLesson[]>> 

  abstract update(
    id: UserLesson["id"],
    payload: DeepPartial<UserLesson>,
  ): Promise<UserLesson | null>;

  abstract remove(id: UserLesson["id"]): Promise<void>;
}
