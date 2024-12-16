import { Module } from "@nestjs/common";
import { RelationalRolePersistenceModule } from "./infrastructure/persistence/relational/relational-persistence.module";
import { RolesService } from "./roles.service";
import { RolesController } from "./roles.controller";

@Module({
  imports: [RelationalRolePersistenceModule],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService, RelationalRolePersistenceModule],
})
export class RolesModule {}
