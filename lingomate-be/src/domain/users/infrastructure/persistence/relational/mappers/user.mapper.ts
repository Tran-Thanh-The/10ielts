import { StatusEnum } from "@/common/enums/status.enum";
import { FileMapper } from "../../../../../../files/infrastructure/persistence/relational/mappers/file.mapper";
import { RoleEntity } from "../../../../../roles/infrastructure/persistence/relational/entities/role.entity";
import { User } from "../../../../domain/user";
import { UserEntity } from "../entities/user.entity";

export class UserMapper {
  static toDomain(raw: UserEntity): User {
    const domainEntity = new User();
    domainEntity.id = raw.id;
    domainEntity.email = raw.email;
    domainEntity.password = raw.password;
    domainEntity.previousPassword = raw.previousPassword;
    domainEntity.provider = raw.provider;
    domainEntity.socialId = raw.socialId;
    domainEntity.fullName = raw.fullName;
    domainEntity.dob = raw.dob;
    if (raw.photo) {
      domainEntity.photo = FileMapper.toDomain(raw.photo);
    }
    domainEntity.role = raw.role;
    domainEntity.status = raw.status;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    domainEntity.deletedAt = raw.deletedAt;
    domainEntity.createdBy = raw.createdBy;
    domainEntity.updatedBy = raw.updatedBy;
    domainEntity.deletedBy = raw.deletedBy;
    return domainEntity;
  }

  static toPersistence(domainEntity: User): UserEntity {
    let role: RoleEntity | undefined = undefined;

    if (domainEntity.role) {
      role = new RoleEntity();
      role.id = Number(domainEntity.role.id);
    }

    const persistenceEntity = new UserEntity();
    if (domainEntity.id && typeof domainEntity.id === "number") {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.status = domainEntity.status ?? StatusEnum.IN_ACTIVE;
    persistenceEntity.email = domainEntity.email;
    persistenceEntity.dob = domainEntity.dob;
    persistenceEntity.password = domainEntity.password;
    persistenceEntity.previousPassword = domainEntity.previousPassword;
    persistenceEntity.provider = domainEntity.provider;
    persistenceEntity.socialId = domainEntity.socialId;
    persistenceEntity.fullName = domainEntity.fullName;
    if (domainEntity.photo) {
      persistenceEntity.photo = FileMapper.toPersistence(domainEntity.photo);
    } else {
      persistenceEntity.photo = null;
    }
    persistenceEntity.role = role;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;
    persistenceEntity.deletedAt = domainEntity.deletedAt;

    persistenceEntity.createdBy = domainEntity.createdBy;
    persistenceEntity.updatedBy = domainEntity.updatedBy;
    persistenceEntity.deletedBy = domainEntity.deletedBy;
    return persistenceEntity;
  }

}
