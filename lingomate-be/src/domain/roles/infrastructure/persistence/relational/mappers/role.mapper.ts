import { Role } from "@/domain/roles/domain/role";
import { RoleEntity } from "../entities/role.entity";
import { CreateRoleDto } from "@/domain/roles/dto/create-role.dto";

export class RoleMapper {
  static toDomain(raw: RoleEntity): Role {
    const domainEntity = new Role();
    domainEntity.id = raw.id;
    domainEntity.name = raw.name;
    domainEntity.permissions = raw.permissions;

    return domainEntity;
  }

  static toPersistence(domainEntity: Role): RoleEntity {
    const persistenceEntity = new RoleEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.name = domainEntity.name;
    persistenceEntity.permissions = domainEntity.permissions;

    return persistenceEntity;
  }

  static toModel(dto: CreateRoleDto): Role {
    const model = new Role();
    model.name = dto.name;
    model.permissions = dto.permissions;
    return model;
  }
}
