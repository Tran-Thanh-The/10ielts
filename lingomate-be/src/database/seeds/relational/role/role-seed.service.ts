import { PermissionEnum } from "@/common/enums/permissions.enum";
import { RoleEntity } from "@/domain/roles/infrastructure/persistence/relational/entities/role.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class RoleSeedService {
  constructor(
    @InjectRepository(RoleEntity)
    private repository: Repository<RoleEntity>,
  ) {}

  async run() {
    const rolesToSeed = [
      {
        name: "Admin",
        permissions: [],
      },
      {
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
          PermissionEnum.CREATE_CATEGORY,
        ],
      },
      {
        name: "User",
        permissions: [
          PermissionEnum.READ_USER,
          PermissionEnum.READ_COURSE,
          PermissionEnum.READ_LESSON,
          PermissionEnum.READ_PRACTICE,
          PermissionEnum.READ_CATEGORY,
        ],
      },
      {
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
          PermissionEnum.CREATE_CATEGORY,
        ],
      },
      {
        name: "CustomerCare",
        permissions: [
          PermissionEnum.READ_USER,
          PermissionEnum.READ_COURSE,
          PermissionEnum.READ_LESSON,
          PermissionEnum.READ_PRACTICE,
          PermissionEnum.READ_CATEGORY,
          PermissionEnum.ACCESS_CHAT,
        ],
      },
    ];

    for (const roleData of rolesToSeed) {
      const existingRole = await this.repository.findOne({
        where: { name: roleData.name },
      });

      if (existingRole) {
        // Cập nhật role nếu đã tồn tại
        existingRole.name = roleData.name;
        existingRole.permissions = roleData.permissions;
        await this.repository.save(existingRole);
      } else {
        const newRole = this.repository.create({
          name: roleData.name,
          permissions: roleData.permissions,
        });
        await this.repository.save(newRole);
      }
    }
  }
}
