export enum FileDriver {
  LOCAL = "local",
  S3 = "s3",
  S3_PRESIGNED = "s3-presigned",
  GOOGLE_DRIVE = "google-drive",
}

export type FileConfig = {
  driver: FileDriver;
  accessKeyId?: string;
  secretAccessKey?: string;
  awsDefaultS3Bucket?: string;
  awsS3Region?: string;
  maxFileSize: number;

  googleDriveClientId?: string;
  googleDriveClientSecret?: string;
  googleDriveRedirectUri?: string;
  googleDriveRefreshToken?: string;
  googleDriveApiKey?: string;
};
