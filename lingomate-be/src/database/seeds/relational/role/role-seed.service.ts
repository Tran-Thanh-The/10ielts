import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RoleEntity } from "@/domain/roles/infrastructure/persistence/relational/entities/role.entity";
import { RoleEnum } from "@/domain/roles/roles.enum";

@Injectable()
export class RoleSeedService {
  constructor(
    @InjectRepository(RoleEntity)
    private repository: Repository<RoleEntity>,
  ) {}

  async run() {
    const countUser = await this.repository.count({
      where: {
        id: RoleEnum.user,
      },
    });

    if (!countUser) {
      await this.repository.save(
        this.repository.create({
          id: RoleEnum.user,
          name: "User",
        }),
      );
    }

    const countAdmin = await this.repository.count({
      where: {
        id: RoleEnum.admin,
      },
    });

    if (!countAdmin) {
      await this.repository.save(
        this.repository.create({
          id: RoleEnum.admin,
          name: "Admin",
        }),
      );
    }

    const countStaff = await this.repository.count({
      where: {
        id: RoleEnum.staff,
      },
    });

    if (!countStaff) {
      await this.repository.save(
        this.repository.create({
          id: RoleEnum.staff,
          name: "Staff",
        }),
      );
    }

    const countTeacher = await this.repository.count({
      where: {
        id: RoleEnum.teacher,
      },
    });

    if (!countTeacher) {
      await this.repository.save(
        this.repository.create({
          id: RoleEnum.teacher,
          name: "Teacher",
        }),
      );
    }
  }
}
