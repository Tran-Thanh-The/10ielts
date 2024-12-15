import { DeepPartial } from "@/utils/types/deep-partial.type";
import { NullableType } from "@/utils/types/nullable.type";
import { IPaginationOptions } from "@/utils/types/pagination-options";
import { UserCourse } from "../../domain/user-course";

export abstract class UserCourseRepository {
  abstract create(
    data: Omit<UserCourse, "id" | "createdAt" | "updatedAt">,
  ): Promise<UserCourse>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<UserCourse[]>;
  abstract save(userCourse: UserCourse): Promise<void>;
  abstract findById(id: UserCourse["id"]): Promise<NullableType<UserCourse>>;
  abstract findUserCourseByUserId(userId: string): Promise<NullableType<UserCourse>>
  abstract findByCourseId(
    course_id: string,
  ): Promise<NullableType<UserCourse[]>>;
  abstract update(
    id: UserCourse["id"],
    payload: DeepPartial<UserCourse>,
  ): Promise<UserCourse | null>;

  abstract remove(id: UserCourse["id"]): Promise<void>;
}
