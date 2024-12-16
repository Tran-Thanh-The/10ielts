import {
  QuestionFileTypesEnum,
  QuestionTypesEnum,
} from "@/common/enums/question.enum";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

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

  @ApiPropertyOptional({
    enum: QuestionFileTypesEnum,
  })
  @IsEnum(QuestionFileTypesEnum)
  @IsOptional()
  fileType?: QuestionFileTypesEnum | null;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  time?: number | null;

  @ApiProperty({
    type: () => String,
  })
  category_id: string;

  @ApiPropertyOptional({
    type: () => String,
  })
  @IsOptional()
  @IsString()
  lesson_id?: string | null;

  @ApiPropertyOptional({
    type: () => String,
  })
  @IsOptional()
  @IsString()
  practice_id?: string | null;
}
