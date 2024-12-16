import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RoleEntity } from "@/domain/roles/infrastructure/persistence/relational/entities/role.entity";
import { RoleEnum } from "@/common/enums/roles.enum";
import { PermissionEnum } from "@/common/enums/permissions.enum";

@Injectable()
export class RoleSeedService {
  constructor(
    @InjectRepository(RoleEntity)
    private repository: Repository<RoleEntity>,
  ) {}

  async run() {
    const rolesToSeed = [
      {
        id: RoleEnum.admin,
        name: "Admin",
        permissions: [],
      },
      {
        id: RoleEnum.staff,
        name: "Staff",
        permissions: [
          PermissionEnum.CREATE_USER,
          PermissionEnum.READ_USER,
          PermissionEnum.UPDATE_USER,
          PermissionEnum.DELETE_USER,
          PermissionEnum.READ_COURSE,
          PermissionEnum.READ_PRACTICE,
          PermissionEnum.READ_LESSON,
          PermissionEnum.READ_QUESTION,
          PermissionEnum.READ_ANSWER,
        ],
      },
      {
        id: RoleEnum.user,
        name: "User",
        permissions: [
          PermissionEnum.READ_USER,
          PermissionEnum.READ_COURSE,
          PermissionEnum.READ_LESSON,
          PermissionEnum.READ_PRACTICE,
        ],
      },
      {
        id: RoleEnum.teacher,
        name: "Teacher",
        permissions: [
          PermissionEnum.CREATE_USER,
          PermissionEnum.READ_USER,
          PermissionEnum.UPDATE_USER,
          PermissionEnum.DELETE_USER,
          PermissionEnum.CREATE_COURSE,
          PermissionEnum.READ_COURSE,
          PermissionEnum.UPDATE_COURSE,
          PermissionEnum.DELETE_COURSE,
          PermissionEnum.CREATE_PRACTICE,
          PermissionEnum.READ_PRACTICE,
          PermissionEnum.UPDATE_PRACTICE,
          PermissionEnum.DELETE_PRACTICE,
        ],
      },
      {
        id: RoleEnum.customerCare,
        name: "CustomerCare",
        permissions: [
          PermissionEnum.READ_USER,
          PermissionEnum.READ_COURSE,
          PermissionEnum.READ_LESSON,
          PermissionEnum.READ_PRACTICE,
          PermissionEnum.ACCESS_CHAT
        ],
      }
    ];

    for (const roleData of rolesToSeed) {
      const existingRole = await this.repository.findOne({ where: { name: roleData.name } });

      if (existingRole) {
        // Cập nhật role nếu đã tồn tại
        existingRole.name = roleData.name;
        existingRole.permissions = roleData.permissions;
        await this.repository.save(existingRole);
      } else {
        // Tạo mới role nếu chưa tồn tại
        await this.repository.save({
          id: roleData.id,
          name: roleData.name,
          permissions: roleData.permissions,
        });
      }
    }
  }
}
