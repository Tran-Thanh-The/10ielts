import { DeepPartial } from "@/utils/types/deep-partial.type";
import { NullableType } from "@/utils/types/nullable.type";
import { IPaginationOptions } from "@/utils/types/pagination-options";
import { Category } from "../../domain/category";

export abstract class CategoryRepository {
  abstract create(
    data: Omit<Category, "id" | "createdAt" | "updatedAt">,
  ): Promise<Category>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Category[]>;

  abstract findById(id: Category["id"]): Promise<NullableType<Category>>;
  abstract findByName(name: Category["name"]): Promise<NullableType<Category>>;
  abstract findByCourseId(courseId: string): Promise<Category | null>;
  abstract update(
    id: Category["id"],
    payload: DeepPartial<Category>,
  ): Promise<Category | null>;

  abstract remove(id: Category["id"]): Promise<void>;
}
