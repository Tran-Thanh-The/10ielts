import { DeepPartial } from "@/utils/types/deep-partial.type";
import { NullableType } from "@/utils/types/nullable.type";
import { IPaginationOptions } from "@/utils/types/pagination-options";
import { Lesson } from "../../domain/lesson";

export abstract class LessonRepository {
  abstract create(
    data: Omit<Lesson, "id" | "createdAt" | "updatedAt" | "deletedAt">,
  ): Promise<Lesson>;

  abstract findAll(): Promise<Lesson[]>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Lesson[]>;

  abstract findAllWithPaginationAndCourseId({
    courseId,
    paginationOptions,
  }: {
    courseId: string;
    paginationOptions: IPaginationOptions;
  }): Promise<Lesson[]>;

  abstract getLessonDetail(id: Lesson["id"]): Promise<NullableType<Lesson>>;

  abstract findById(id: Lesson["id"]): Promise<NullableType<Lesson>>;
  abstract findByQuestionId(questionId: string): Promise<NullableType<Lesson>>;
  abstract findByTitle(title: Lesson["title"]): Promise<NullableType<Lesson>>;

  abstract update(
    id: Lesson["id"],
    payload: DeepPartial<Lesson>,
  ): Promise<Lesson | null>;

  abstract remove(id: Lesson["id"]): Promise<void>;
  abstract save(lesson: Lesson): Promise<void>;
}
