import { AllConfigType } from "@/config/config.type";
import { HttpStatus, Injectable, UnprocessableEntityException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { google } from "googleapis";
import { unlink } from 'fs/promises';
import { FileRepository } from "../../persistence/file.repository";
import { FileType } from "@/files/domain/file";
import { createReadStream } from 'fs';

@Injectable()
export class FilesGoogleDriveService {
  private drive;

  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    private readonly fileRepository: FileRepository,
  ) {
    try {
      const clientId = this.configService.get("file.googleDriveClientId", { infer: true });
      const clientSecret = this.configService.get("file.googleDriveClientSecret", { infer: true });
      const redirectUri = this.configService.get("file.googleDriveRedirectUri", { infer: true });
      const refreshToken = this.configService.get("file.googleDriveRefreshToken", { infer: true });

      const oauth2Client = new google.auth.OAuth2(
        clientId,
        clientSecret,
        redirectUri
      );

      oauth2Client.setCredentials({
        refresh_token: refreshToken
      });

      this.drive = google.drive({ version: "v3", auth: oauth2Client });
    } catch (error) {
      console.error('Error initializing Google Drive service:', error);
    }
  }

  private async getFileUrl(fileId: string, mimeType: string): Promise<string> {
    try {
      // Xử lý video và audio
      if (mimeType.startsWith('video/') || mimeType.startsWith('audio/')) {
        const apiKey = this.configService.get("file.googleDriveApiKey", { infer: true });
        return `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${apiKey}`;
      }
  
      // Xử lý PDF
      if (mimeType === 'application/pdf') {
        return `https://drive.google.com/file/d/${fileId}/preview`;
      }
  
      // Xử lý ảnh
      return `https://lh3.googleusercontent.com/d/${fileId}`;
  
    } catch (error) {
      console.error('Lỗi khi lấy URL file:', error);
      throw new Error('Không thể lấy được URL file');
    }
  }
  async create(file: Express.Multer.File): Promise<{ file: FileType }> {
    if (!file) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          file: "selectFile",
        },
      });
    }
  
    try {
      const fileMetadata = {
        name: file.originalname,
        mimeType: file.mimetype,
      };
  
      const media = {
        mimeType: file.mimetype,
        body: createReadStream(file.path),
      };
  
      const driveFile = await this.drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: "id",
      });
  
      await this.drive.permissions.create({
        fileId: driveFile.data.id,
        requestBody: {
          role: "reader",
          type: "anyone",
          allowFileDiscovery: false
        },
      });

      const directLink = await this.getFileUrl(driveFile.data.id, file.mimetype);
      const result = await this.fileRepository.create({
        path: directLink,
      });
  
      await unlink(file.path);
  
      return { file: result };
    } catch (error) {
      try {
        await unlink(file.path);
      } catch (unlinkError) {
        // Handle unlink error silently
      }
  
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          file: "uploadFailed",
          details: error.message
        },
      });
    }
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
      const fileId = this.extractFileIdFromUrl(file.path);

      try {
        await this.drive.files.get({ fileId });
      } catch (getError) {
        if (getError.code === 404) {
          console.log("File already deleted or not found.");
          return;
        }
        throw getError;
      }

      // Xóa file từ Google Drive
      const response = await this.drive.files.delete({ fileId });
      if (response.status === 204) {
        console.log('File deleted successfully from Google Drive');
      } else {
        console.log('Failed to delete file from Google Drive:', response.status);
      }

      // Xóa record từ database
      const fileRecord = await this.fileRepository.findById(file.id);
      if (fileRecord) {
        await this.fileRepository.delete(file.id);
        console.log('File record deleted from database');
      } else {
        console.log("File record not found in database.");
      }
    } catch (error) {
      console.error('Error during file delete process:', error.response?.data || error.message || error);
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          file: "deleteFileFailed",
          details: error.response?.data || error.message,
        },
      });
    }
  }

  private extractFileIdFromUrl(url: string): string {
    const match = url.match(/[-\w]{25,}/);
    if (!match) {
      throw new Error(`Invalid file URL: ${url}`);
    }
    return match[0];
  }
}