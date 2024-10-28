import { DeepPartial } from "@/utils/types/deep-partial.type";
import { NullableType } from "@/utils/types/nullable.type";
import { IPaginationOptions } from "@/utils/types/pagination-options";
import { Question } from "../../domain/question";

export abstract class QuestionRepository {
  abstract create(
    data: Omit<Question, "id" | "createdAt" | "updatedAt">,
  ): Promise<Question>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Question[]>;

  abstract findById(id: Question["id"]): Promise<NullableType<Question>>;
  abstract countActiveQuestionsByLessonId(lessonId: string): Promise<number>;
  abstract findActiveQuestionsByLessonId(lessonId: string): Promise<Question[]>;
  abstract update(
    id: Question["id"],
    payload: DeepPartial<Question>,
  ): Promise<Question | null>;

  abstract remove(id: Question["id"]): Promise<void>;
  abstract save(question: Question): Promise<void>;
}
