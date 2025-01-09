import { Body, Controller, Get, Post, Res, UseGuards } from "@nestjs/common";
import { AiService } from "./ai.service";
import { Response } from "express";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { EvaluateWritingDto } from "./dto/evaluate-writing.dto";

@ApiTags("AI")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({
  path: "/ai",
  version: "1",
})
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post("/evaluate-writing")
  async evaluateWriting(
    @Body() body: EvaluateWritingDto,
    @Res() res: Response
  ) {
    try {
      const response = await this.aiService.evaluateWritingPrompt(
        body.topic,
        body.writingAssignmentSubmission
      );
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  @Get("/generate-practice")
  async generatePractice(@Res() res: Response) {
    try {
      const response = await this.aiService.generatePracticePrompt();
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
