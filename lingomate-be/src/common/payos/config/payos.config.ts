import { registerAs } from "@nestjs/config";
import { PayOSConfig } from "@/common/payos/config/payos-config.type";
import validateConfig from "@/utils/validate-config";
import { IsString, ValidateIf } from "class-validator";

class PayOSEnvironmentVariablesValidator {
  // Add your environment variables here
  @ValidateIf((envValues) => envValues.PAYOS_CLIENT_ID)
  @IsString()
  PAYOS_CLIENT_ID: string;

  @ValidateIf((envValues) => envValues.PAYOS_API_KEY)
  @IsString()
  PAYOS_API_KEY: string;

  @ValidateIf((envValues) => envValues.PAYOS_CHECKSUM_KEY)
  @IsString()
  PAYOS_CHECKSUM_KEY: string;

  @ValidateIf((envValues) => envValues.PAYOS_RETURN_URL)
  @IsString()
  PAYOS_RETURN_URL: string;

  @ValidateIf((envValues) => envValues.PAYOS_CANCEL_URL)
  @IsString()
  PAYOS_CANCEL_URL: string;

  // @ValidateIf((envValues) => envValues.PAYOS_SIGNATURE)
  // @IsString()
  // PAYOS_SIGNATURE: string;
}

export default registerAs<PayOSConfig>("payos", () => {
  validateConfig(process.env, PayOSEnvironmentVariablesValidator);

  return {
    // Add your configuration here
    clientId: process.env.PAYOS_CLIENT_ID || "default_client_id",
    apiKey: process.env.PAYOS_API_KEY || "default_api_key",
    checksumKey: process.env.PAYOS_CHECKSUM_KEY || "default_checksum_key",
    returnUrl: process.env.PAYOS_RETURN_URL || "https://example.com/return",
    cancelUrl: process.env.PAYOS_CANCEL_URL || "https://example.com/cancel",
    // signature: process.env.PAYOS_SIGNATURE || "",
  };
});
