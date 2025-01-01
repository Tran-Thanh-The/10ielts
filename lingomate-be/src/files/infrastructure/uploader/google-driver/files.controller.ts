import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiTags,
} from "@nestjs/swagger";
import { FileResponseDto } from "../local/dto/file-response.dto";
import { FilesGoogleDriveService } from "./files.service";
import { AuthGuard } from "@nestjs/passport";

@ApiTags("Files")
@Controller({
  path: "files",
  version: "1",
})
export class FilesGoogleDriveController {
  constructor(private readonly filesService: FilesGoogleDriveService) {}

  @ApiCreatedResponse({
    type: FileResponseDto,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @Post("upload")
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<FileResponseDto> {
    return this.filesService.create(file);
  }
}

// 5. Update files.module.ts to include Google Drive
