import { DeepPartial } from "@/utils/types/deep-partial.type";
import { NullableType } from "@/utils/types/nullable.type";
import { IPaginationOptions } from "@/utils/types/pagination-options";
import { Role } from "../../domain/role";

export abstract class RoleRepository {
  abstract create(data: Omit<Role, "id">): Promise<Role>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Role[]>;

  abstract findById(id: Role["id"]): Promise<NullableType<Role>>;
  abstract findByName(name: Role["name"]): Promise<NullableType<Role>>;
  abstract update(
    id: Role["id"],
    payload: DeepPartial<Role>,
  ): Promise<Role | null>;

  abstract remove(id: Role["id"]): Promise<void>;
}
