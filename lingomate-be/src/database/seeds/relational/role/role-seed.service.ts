import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RoleEntity } from "@/domain/roles/infrastructure/persistence/relational/entities/role.entity";
import { RoleEnum } from "@/domain/roles/roles.enum";
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
        id: RoleEnum.admin,
        name: "Admin",
        permissions: [
         
        ],
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
      }
    ];

    // for (const roleData of rolesToSeed) {
    //   // Tìm role theo ID
    //   const existingRole = await this.repository.findOne({ 
    //     where: { id: roleData.id } 
    //   });

    //   if (existingRole) {
    //     // Nếu role đã tồn tại, cập nhật thông tin
    //     await this.repository.save({
    //       ...existingRole,
    //       name: roleData.name,
    //       permissions: roleData.permissions
    //     });
    //   } else {
    //     // Nếu role chưa tồn tại, tạo mới
    //     await this.repository.save(
    //       this.repository.create(roleData)
    //     );
    //   }
    // }
    for (const roleData of rolesToSeed) {
      await this.repository.upsert(
        {
          id: roleData.id,
          name: roleData.name,
          permissions: roleData.permissions,
        },
        ['id']
      );
    }
  }
}