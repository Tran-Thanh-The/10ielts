import {
  QuestionFileTypesEnum,
  QuestionTypesEnum,
} from "@/common/enums/question.enum";
import { StatusEnum } from "@/common/enums/status.enum";
import { AnswerResponseDto } from "@/domain/answers/dto/response-answer.dto";
import { CreateCategoryDto } from "@/domain/categories/dto/create-category.dto";
import { FileDto } from "@/files/dto/file.dto";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";

export class QuestionResponseDto {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  content?: string | null;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  explain?: string | null;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  position?: number | null;

  @ApiPropertyOptional({ type: () => FileDto })
  @IsOptional()
  file?: FileDto | null;

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
    enum: StatusEnum,
  })
  @IsEnum(StatusEnum)
  status: StatusEnum;

  @ApiProperty({
    type: () => CreateCategoryDto,
  })
  @IsNotEmpty()
  category: CreateCategoryDto;

  @ApiProperty({
    type: () => String,
  })
  @IsNotEmpty()
  lesson_id: string;

  @ApiProperty({
    type: () => String,
  })
  @IsNotEmpty()
  practice_id: string;

  @ApiProperty({
    type: [AnswerResponseDto],
    description: "Array of Answers in the question",
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerResponseDto)
  answers?: AnswerResponseDto[];

  @ApiProperty({ type: Date })
  createdAt?: Date;

  @ApiProperty({ type: Date })
  updatedAt?: Date;

  @ApiProperty({ type: Number })
  createdBy: number;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  updatedBy?: number | null;
}
