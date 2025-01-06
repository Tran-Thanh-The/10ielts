import { GoogleGeminiService } from "@/common/google-gemini/google-gemini.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AiService {
  constructor(private readonly googleGeminiService: GoogleGeminiService) {}

  async evaluateWritingPrompt(
    topic: string,
    writingAssignmentSubmission: string,
  ) {
    try {
      const result = await this.googleGeminiService.evaluateWritingPrompt(
        topic,
        writingAssignmentSubmission,
      );
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
