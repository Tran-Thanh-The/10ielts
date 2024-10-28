import {
  QuestionFileTypesEnum,
  QuestionTypesEnum,
} from "@/common/enums/question.enum";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional } from "class-validator";

export class CreateQuestionDto {
  // Don't forget to use the class-validator decorators in the DTO properties.
  @ApiProperty({ type: String })
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  content?: string | null;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  explain?: string | null;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  position?: number | null;

  @ApiProperty({
    enum: QuestionTypesEnum,
  })
  @IsNotEmpty()
  @IsEnum(QuestionTypesEnum)
  questionType: QuestionTypesEnum;

  @ApiProperty({
    enum: QuestionFileTypesEnum,
  })
  @IsNotEmpty()
  @IsEnum(QuestionFileTypesEnum)
  fileType: QuestionFileTypesEnum;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  time?: number | null;

  @ApiProperty({
    type: () => String,
  })
  category_id: string;

  @ApiProperty({
    type: () => String,
  })
  lesson_id: string;
}
