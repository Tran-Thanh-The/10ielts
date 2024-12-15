import { ConflictException, Injectable } from "@nestjs/common";
import { IPaginationOptions } from "@/utils/types/pagination-options";
import { RoleRepository } from "./infrastructure/persistence/role.repository";
import { CreateRoleDto } from "./dto/create-role.dto";
import { Role } from "./domain/role";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { RoleMapper } from "./infrastructure/persistence/relational/mappers/role.mapper";


@Injectable()
export class RolesService {
  constructor(private readonly roleRepository: RoleRepository) {}

  async create(createRoleDto: CreateRoleDto) {
    const existingRole = await this.roleRepository.findByName(
      createRoleDto.name,
    );
    if (existingRole) {
      throw new ConflictException(
        `Role with name "${createRoleDto.name}" already exists.`,
      );
    }
    const model = RoleMapper.toModel(createRoleDto);
    return this.roleRepository.create(model);
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.roleRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findOne(id: Role["id"]) {
    return this.roleRepository.findById(id);
  }

  update(id: Role["id"], updateRoleDto: UpdateRoleDto) {
    return this.roleRepository.update(id, updateRoleDto);
  }

  remove(id: Role["id"]) {
    return this.roleRepository.remove(id);
  }
}
