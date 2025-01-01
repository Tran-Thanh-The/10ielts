import { ConfigModule, ConfigService } from "@nestjs/config";
import { RelationalFilePersistenceModule } from "../../persistence/relational/relational-persistence.module";
import { FilesGoogleDriveService } from "./files.service";
import { FilesGoogleDriveController } from "./files.controller";
import { Module } from "@nestjs/common";

@Module({
  imports: [RelationalFilePersistenceModule],
  controllers: [FilesGoogleDriveController],
  providers: [ConfigModule, ConfigService, FilesGoogleDriveService],
  exports: [FilesGoogleDriveService],
})
export class FilesGoogleDriveModule {}
