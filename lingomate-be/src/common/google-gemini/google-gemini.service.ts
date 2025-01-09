import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class GoogleGeminiService {
  private evaluateWritingSchema = {
    type: SchemaType.OBJECT,
    properties: {
      feedback: {
        type: SchemaType.STRING,
        description:
          "Vietnamese evaluation content addressing document structure, content overview, and grammar usage. Maximum length: 400 characters.",
        nullable: false,
      },
      score: {
        type: SchemaType.NUMBER,
        description:
          "Score of the content, from 0 to 100. With a error margin of 5 points.",
        nullable: false,
      },
    },
  };

  private generatePracticePromptSchema = {
    description: "List of 5 single choice questions",
    type: SchemaType.ARRAY,
    items: {
      type: SchemaType.OBJECT,
      properties: {
        question: {
          type: SchemaType.STRING,
          description:
            "A question about English grammar, similar to the sample from tests like TOEIC. Maximum length: 200 characters.",
          nullable: false,
        },
        options: {
          type: SchemaType.ARRAY,
          description:
            "List of 4 options for the question. Maximum length: 50 characters.",
          items: {
            type: SchemaType.OBJECT,
            properties: {
              text: {
                type: SchemaType.STRING,
                description:
                  "Option text in english. Maximum length: 50 characters.",
                nullable: false,
              },
              isCorrect: {
                type: SchemaType.BOOLEAN,
                description: "Correct answer indicator",
                nullable: false,
              },
            },
          },
          nullable: false,
        },
      },
    },
  };

  constructor(
    @Inject("GOOGLE_GEMINI_CLIENT")
    private readonly googleGeminiClient: GoogleGenerativeAI
  ) {}

  async evaluateWritingPrompt(
    topic: string,
    writingAssignmentSubmission: string
  ) {
    const evaluateWritingModel = this.googleGeminiClient.getGenerativeModel({
      model: "gemini-1.5-pro",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: this.evaluateWritingSchema,
      },
    });
    try {
      const response = await evaluateWritingModel.generateContent({
        contents: [
          {
            role: "model",
            parts: [
              {
                text: "You are a language teacher in VietNam. You are evaluating a writing of a student. Here is the writing and your feedback to the student:",
              },
            ],
          },
          {
            role: "user",
            parts: [
              {
                text: `Topic: ${topic}\n\nStudent's Writing:\n${writingAssignmentSubmission}`,
              },
            ],
          },
        ],
      });
      if (!response?.response?.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error("Error while evaluating writing prompt");
      }
      const result = JSON.parse(
        response?.response?.candidates?.[0]?.content?.parts?.[0]?.text
      );
      return result;
    } catch (error) {
      console.error("Error while evaluating writing prompt", error);
      throw new Error(
        `Error while evaluating writing prompt: ${error.message}`
      );
    }
  }

  async generatePracticePrompt() {
    const generatePracticeModel = this.googleGeminiClient.getGenerativeModel({
      model: "gemini-1.5-pro",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: this.generatePracticePromptSchema,
      },
    });
    try {
      const response = await generatePracticeModel.generateContent({
        contents: [
          {
            role: "model",
            parts: [
              {
                text: "You are a language teacher in VietNam. You are preparing a practice for your students. Here are 5 questions for the practice:",
              }
            ]
          }
        ]
      });
      if (!response?.response?.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error("Error while generate practice prompt");
      }
      const result = JSON.parse(
        response?.response?.candidates?.[0]?.content?.parts?.[0]?.text
      );
      return result;
    } catch (error) {
      console.error("Error while generate practice prompt", error);
      throw new Error(`Error while generate practice prompt: ${error.message}`);
    }
  }
}
