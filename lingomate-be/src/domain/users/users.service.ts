import { StatusEnum } from "@/common/enums/status.enum";
import { AuthProvidersEnum } from "@/domain/auth/auth-providers.enum";
import { DeepPartial } from "@/utils/types/deep-partial.type";
import { NullableType } from "@/utils/types/nullable.type";
import { IPaginationOptions } from "@/utils/types/pagination-options";
import {
  HttpStatus,
  Injectable,
  NotFoundException,
  UnprocessableEntityException
} from "@nestjs/common";
import bcrypt from "bcryptjs";
import { FilesService } from "../../files/files.service";
import { RoleEnum } from "../roles/roles.enum";
import { User } from "./domain/user";
import { CreateUserDto } from "./dto/create-user.dto";
import { FilterUserDto, SortUserDto } from "./dto/query-user.dto";
import { UserRepository } from "./infrastructure/persistence/user.repository";

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly filesService: FilesService,
  ) {}

  async create( userId: string | null, createProfileDto: CreateUserDto): Promise<User> {
    const clonedPayload = {
      provider: AuthProvidersEnum.email,
      ...createProfileDto,
      createdBy: Number(userId),
    };
    if (clonedPayload.password) {
      const salt = await bcrypt.genSalt();
      clonedPayload.password = await bcrypt.hash(clonedPayload.password, salt);
    }

    if (clonedPayload.email) {
      const userObject = await this.usersRepository.findByEmail(
        clonedPayload.email,
      );
      if (userObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: "emailAlreadyExists",
          },
        });
      }
    }

    if (clonedPayload.photo?.id) {
      const fileObject = await this.filesService.findById(
        clonedPayload.photo.id,
      );
      if (!fileObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            photo: "imageNotExists",
          },
        });
      }
      clonedPayload.photo = fileObject;
    }

    if (clonedPayload.role) {
      const isRoleValid = Object.values(RoleEnum).includes(
        clonedPayload.role.id,
      );
      if (!isRoleValid) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            role: "roleNotExists",
          },
        });
      }
    } else {
      clonedPayload.role = { id: RoleEnum.user };
    }
    clonedPayload.status = StatusEnum.ACTIVE;
    
    return this.usersRepository.create(clonedPayload);
  }

  findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterUserDto | null;
    sortOptions?: SortUserDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<User[]> {
    return this.usersRepository.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }

  findById(id: User["id"]): Promise<NullableType<User>> {
    return this.usersRepository.findById(id);
  }

  findByEmail(email: User["email"]): Promise<NullableType<User>> {
    return this.usersRepository.findByEmail(email);
  }

  findBySocialIdAndProvider({
    socialId,
    provider,
  }: {
    socialId: User["socialId"];
    provider: User["provider"];
  }): Promise<NullableType<User>> {
    return this.usersRepository.findBySocialIdAndProvider({
      socialId,
      provider,
    });
  }

  async update(
    userId: string | null,
    id: User["id"],
    payload: DeepPartial<User>,
  ): Promise<User | null> {
    const clonedPayload = { ...payload };

    if (
      clonedPayload.password &&
      clonedPayload.previousPassword !== clonedPayload.password
    ) {
      const salt = await bcrypt.genSalt();
      clonedPayload.password = await bcrypt.hash(clonedPayload.password, salt);
    }

    if (clonedPayload.email) {
      const userObject = await this.usersRepository.findByEmail(
        clonedPayload.email,
      );

      if (userObject && userObject.id !== id) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: "emailAlreadyExists",
          },
        });
      }
    }

    if (clonedPayload.photo?.id) {
      const fileObject = await this.filesService.findById(
        clonedPayload.photo.id,
      );
      if (!fileObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            photo: "imageNotExists",
          },
        });
      }
      clonedPayload.photo = fileObject;
    }

    if (clonedPayload.role?.id) {
      const roleObject = Object.values(RoleEnum)
        .map(String)
        .includes(String(clonedPayload.role.id));
      if (!roleObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            role: "roleNotExists",
          },
        });
      }
    }

    if (clonedPayload.status) {
      const statusObject = Object.values(StatusEnum)
        .map(String)
        .includes(String(clonedPayload.status));
      if (!statusObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            status: "statusNotExists",
          },
        });
      }
    }
    if (userId) {
      clonedPayload.updatedBy = Number(userId);
    }
    return this.usersRepository.update(id, clonedPayload);
  }

  async remove(userId: string | null, id: User["id"]): Promise<void> {
    if (userId) {
      const user = await this.usersRepository.findById(id);
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found.`);
      }
        // Cập nhật deletedBy
      user.deletedBy = Number(userId);
      await this.usersRepository.save(user);
    }

    await this.usersRepository.remove(id);
  }
}
