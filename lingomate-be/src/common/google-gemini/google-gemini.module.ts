import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGeminiService } from "./google-gemini.service";

@Global()
@Module({
  providers: [
    {
      provide: "GOOGLE_GEMINI_CLIENT",
      useFactory: (configService: ConfigService) => {
        // const model = configService.get<string>("GEMINI_MODEL", {
        //   infer: true,
        // });
        const apiKey = configService.get<string>("GEMINI_API_KEY", {
          infer: true,
        });
        console.log("GOOGLE_GEMINI_API_KEY", apiKey);
        if (!apiKey) {
          throw new Error("Missing required configuration for Google Gemini");
        }
        return new GoogleGenerativeAI(apiKey);
      },
      inject: [ConfigService],
    },
    GoogleGeminiService,
  ],
  exports: ["GOOGLE_GEMINI_CLIENT", GoogleGeminiService],
})
export class GoogleGeminiModule {}
