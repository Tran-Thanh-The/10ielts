import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { NullableType } from "@/utils/types/nullable.type";
import { IPaginationOptions } from "@/utils/types/pagination-options";
import { RoleEntity } from "../entities/role.entity";
import { Role } from "@/domain/roles/domain/role";
import { RoleMapper } from "../mappers/role.mapper";
import { RoleRepository } from "../../role.repository";

@Injectable()
export class RoleRelationalRepository implements RoleRepository {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  async create(data: Role): Promise<Role> {
    const persistenceModel = RoleMapper.toPersistence(data);
    const newEntity = await this.roleRepository.save(
      this.roleRepository.create(persistenceModel),
    );
    return RoleMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Role[]> {
    const entities = await this.roleRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => RoleMapper.toDomain(entity));
  }

  async findById(id: Role["id"]): Promise<NullableType<Role>> {
    const entity = await this.roleRepository.findOne({
      where: { id },
    });

    return entity ? RoleMapper.toDomain(entity) : null;
  }

  async findByName(name: Role["name"]): Promise<NullableType<Role>> {
    const entity = await this.roleRepository.findOne({
      where: { name },
    });

    return entity ? RoleMapper.toDomain(entity) : null;
  }

  async update(id: Role["id"], payload: Partial<Role>): Promise<Role> {
    const entity = await this.roleRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error("Record not found");
    }

    const updatedEntity = await this.roleRepository.save(
      this.roleRepository.create(
        RoleMapper.toPersistence({
          ...RoleMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return RoleMapper.toDomain(updatedEntity);
  }

  async remove(id: Role["id"]): Promise<void> {
    await this.roleRepository.delete(id);
  }
}
