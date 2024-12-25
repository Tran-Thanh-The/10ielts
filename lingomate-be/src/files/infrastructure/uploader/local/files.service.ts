import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { FileRepository } from "../../persistence/file.repository";
import { AllConfigType } from "../../../../config/config.type";
import { FileType } from "../../../domain/file";

@Injectable()
export class FilesLocalService {
  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    private readonly fileRepository: FileRepository,
  ) {}

  async create(file: Express.Multer.File): Promise<{ file: FileType }> {
    if (!file) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          file: "selectFile",
        },
      });
    }
    const filePath = `/${this.configService.get("app.apiPrefix", {
      infer: true,
    })}/v1/files/${file.filename}`;
    console.log(`filePath: ${JSON.stringify(file)}`);
    return {
      file: await this.fileRepository.create({
        path: filePath,
      }),
    };
  }

  async delete(file: FileType): Promise<void> {
    if (!file) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          file: "fileNotProvided",
        },
      });
    }

    try {
      // Xóa file từ FileRepository
      await this.fileRepository.delete(file.id);
    } catch (error) {
      console.log("Error when delete file: ", error);

      // Xử lý lỗi nếu không thể xóa file
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          file: "deleteFileFailed",
        },
      });
    }
  }
}
