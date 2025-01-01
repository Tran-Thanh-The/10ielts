import { registerAs } from "@nestjs/config";

import { IsEnum, IsOptional, IsString, ValidateIf } from "class-validator";
import validateConfig from "../../utils/validate-config";
import { FileDriver, FileConfig } from "./file-config.type";

class EnvironmentVariablesValidator {
  @IsEnum(FileDriver)
  FILE_DRIVER: FileDriver;

  @ValidateIf((envValues) => envValues.FILE_DRIVER === FileDriver.GOOGLE_DRIVE)
  @IsString()
  GOOGLE_DRIVE_CLIENT_ID: string;

  @ValidateIf((envValues) => envValues.FILE_DRIVER === FileDriver.GOOGLE_DRIVE)
  @IsString()
  GOOGLE_DRIVE_CLIENT_SECRET: string;

  @ValidateIf((envValues) => envValues.FILE_DRIVER === FileDriver.GOOGLE_DRIVE)
  @IsString()
  GOOGLE_DRIVE_REDIRECT_URI: string;

  @ValidateIf((envValues) => envValues.FILE_DRIVER === FileDriver.GOOGLE_DRIVE)
  @IsString()
  GOOGLE_DRIVE_REFRESH_TOKEN: string;

  @ValidateIf((envValues) => envValues.FILE_DRIVER === FileDriver.GOOGLE_DRIVE)
  @IsOptional()
  @IsString()
  GOOGLE_DRIVE_API_KEY: string;

  @ValidateIf((envValues) =>
    [FileDriver.S3, FileDriver.S3_PRESIGNED].includes(envValues.FILE_DRIVER),
  )
  @IsString()
  ACCESS_KEY_ID: string;

  @ValidateIf((envValues) =>
    [FileDriver.S3, FileDriver.S3_PRESIGNED].includes(envValues.FILE_DRIVER),
  )
  @IsString()
  SECRET_ACCESS_KEY: string;

  @ValidateIf((envValues) =>
    [FileDriver.S3, FileDriver.S3_PRESIGNED].includes(envValues.FILE_DRIVER),
  )
  @IsString()
  AWS_DEFAULT_S3_BUCKET: string;

  @ValidateIf((envValues) =>
    [FileDriver.S3, FileDriver.S3_PRESIGNED].includes(envValues.FILE_DRIVER),
  )
  @IsString()
  AWS_S3_REGION: string;
}

export default registerAs<FileConfig>("file", () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    driver:
      (process.env.FILE_DRIVER as FileDriver | undefined) ?? FileDriver.LOCAL,
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    awsDefaultS3Bucket: process.env.AWS_DEFAULT_S3_BUCKET,
    awsS3Region: process.env.AWS_S3_REGION,
    // maxFileSize: 5242880, // 5mb

    maxFileSize: 1073741824, // 1GB
    googleDriveClientId: process.env.GOOGLE_DRIVE_CLIENT_ID,
    googleDriveClientSecret: process.env.GOOGLE_DRIVE_CLIENT_SECRET,
    googleDriveRedirectUri: process.env.GOOGLE_DRIVE_REDIRECT_URI,
    googleDriveRefreshToken: process.env.GOOGLE_DRIVE_REFRESH_TOKEN,
    googleDriveApiKey: process.env.GOOGLE_DRIVE_API_KEY,
  };
});
