import { registerAs } from "@nestjs/config";
import { IsString, ValidateIf } from "class-validator";
import { GoogleGeminiConfig } from "./google-gemini-config.type";
import validateConfig from "@/utils/validate-config";

class GoogleGeminiEnvironmentVariablesValidator {
  @ValidateIf((envValues) => envValues.GEMINI_CLIENT_ID)
  @IsString()
  GEMINI_API_KEY: string;

  // @ValidateIf((envValues) => envValues.GEMINI_MODEL)
  // @IsString()
  // GEMINI_MODEL: string;
}

export default registerAs<GoogleGeminiConfig>("googleGemini", () => {
  validateConfig(process.env, GoogleGeminiEnvironmentVariablesValidator);

  return {
    apiKey: process.env.GEMINI_API_KEY || "default_api_key",
    // model: process.env.GEMINI_MODEL || "default_model",
  };
});
