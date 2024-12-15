import { Module } from "@nestjs/common";
import { RoleRepository } from "../role.repository";
import { RoleRelationalRepository } from "./repositories/role.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RoleEntity } from "./entities/role.entity";

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity])],
  providers: [
    {
      provide: RoleRepository,
      useClass: RoleRelationalRepository,
    },
  ],
  exports: [RoleRepository],
})
export class RelationalRolePersistenceModule {}
