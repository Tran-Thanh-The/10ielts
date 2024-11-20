import { Module } from "@nestjs/common";

import { UsersController } from "./users.controller";

import { UsersService } from "./users.service";
import { RelationalUserPersistenceModule } from "./infrastructure/persistence/relational/relational-persistence.module";
import { FilesModule } from "../../files/files.module";
import { UserEntity } from "./infrastructure/persistence/relational/entities/user.entity";

const infrastructurePersistenceModule = RelationalUserPersistenceModule;

@Module({
  imports: [infrastructurePersistenceModule, FilesModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, infrastructurePersistenceModule],
})
export class UsersModule {}
