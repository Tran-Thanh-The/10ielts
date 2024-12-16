import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";
import bcrypt from "bcryptjs";
import { RoleEnum } from "@/common/enums/roles.enum";
import { UserEntity } from "@/domain/users/infrastructure/persistence/relational/entities/user.entity";
import { StatusEnum } from "@/common/enums/status.enum";

@Injectable()
export class UserSeedService {
  private dateCreatedSeed = new Date();
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,
  ) {}

  async run() {
    const countAdmin = await this.repository.count({
      where: {
        role: {
          id: RoleEnum.admin,
        },
      },
    });

    if (!countAdmin) {
      const salt = await bcrypt.genSalt();
      const password = await bcrypt.hash("string", salt);

      await this.repository.save(
        this.repository.create({
          fullName: "Tien Anh",
          email: "tien226anh@gmail.com",
          password,
          role: {
            id: RoleEnum.admin,
            name: "Admin",
          },
          status: StatusEnum.ACTIVE,
          dob: this.dateCreatedSeed,
        }),
      );
    }

    const countStaff = await this.repository.count({
      where: {
        role: {
          id: RoleEnum.staff,
        },
      },
    });

    if (!countStaff) {
      const salt = await bcrypt.genSalt();
      const password = await bcrypt.hash("string", salt);

      await this.repository.save(
        this.repository.create({
          fullName: "Leaping",
          email: "leaping226@gmail.com",
          password,
          role: {
            id: RoleEnum.staff,
            name: "Staff",
          },
          status: StatusEnum.ACTIVE,
          dob: this.dateCreatedSeed,
        }),
      );
    }

    const countUser = await this.repository.count({
      where: {
        role: {
          id: RoleEnum.user,
        },
      },
    });

    if (!countUser) {
      const salt = await bcrypt.genSalt();
      const password = await bcrypt.hash("string", salt);

      await this.repository.save(
        this.repository.create({
          fullName: "user",
          email: "user1@gmail.com",
          password,
          role: {
            id: RoleEnum.user,
            name: "User",
          },
          status: StatusEnum.ACTIVE,
          dob: this.dateCreatedSeed,
        }),
      );
    }

    const countTeacher = await this.repository.count({
      where: {
        role: {
          id: RoleEnum.teacher,
        },
      },
    });

    if (!countTeacher) {
      const salt = await bcrypt.genSalt();
      const password = await bcrypt.hash("string", salt);

      await this.repository.save(
        this.repository.create({
          fullName: "Teacher Test",
          email: "teacher1@gmail.com",
          password,
          role: {
            id: RoleEnum.teacher,
            name: "Teacher",
          },
          status: StatusEnum.ACTIVE,
          dob: this.dateCreatedSeed,
        }),
      );
    }

    const countCustomerCare = await this.repository.count({
      where: {
        role: {
          id: RoleEnum.customerCare,
        },
      },
    });

    if (!countCustomerCare) {
      const salt = await bcrypt.genSalt();
      const password = await bcrypt.hash("string", salt);

      await this.repository.save(
        this.repository.create({
          fullName: "Customer Care Test",
          email: "customerCare1@gmail.com",
          password,
          role: {
            id: RoleEnum.customerCare,
            name: "CustomerCare",
          },
          status: StatusEnum.ACTIVE,
          dob: this.dateCreatedSeed,
        }),
      );
    }
  }
}
