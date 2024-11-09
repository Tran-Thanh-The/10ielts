import { AppConfig } from "./app-config.type";
import { AuthConfig } from "@/domain/auth/config/auth-config.type";
import { DatabaseConfig } from "../database/config/database-config.type";
import { FileConfig } from "../files/config/file-config.type";
import { MailConfig } from "../mail/config/mail-config.type";
import { PayOSConfig } from "@/common/payos/config/payos-config.type";

export type AllConfigType = {
  app: AppConfig;
  auth: AuthConfig;
  database: DatabaseConfig;
  file: FileConfig;
  mail: MailConfig;
  payos: PayOSConfig;
};
