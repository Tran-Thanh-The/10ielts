import { DifficultyEnum, PracticeTypeEnum } from "@/common/enums/practice.enum";
import { StatusEnum } from "@/common/enums/status.enum";
import { QuestionResponseDto } from "@/domain/questions/dto/response-question.dto";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";

export class PracticeResponseDto {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  description?: string | null;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  content?: string | null;

  @ApiPropertyOptional({
    type: Number,
    description: "Price of the course in dollars, allowing decimal values",
    example: 49.99,
  })
  @IsNumber()
  @IsOptional()
  price?: number | null;

  @ApiProperty({
    enum: PracticeTypeEnum,
  })
  @IsNotEmpty()
  @IsEnum(PracticeTypeEnum)
  practiceType: PracticeTypeEnum;

  @ApiProperty({
    enum: DifficultyEnum,
  })
  @IsNotEmpty()
  @IsEnum(DifficultyEnum)
  difficulty: DifficultyEnum;

  @ApiPropertyOptional({
    enum: StatusEnum,
  })
  @IsEnum(StatusEnum)
  @IsOptional()
  status?: StatusEnum;

  @ApiProperty({
    type: [QuestionResponseDto],
    description: "Array of Questions in the lesson",
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionResponseDto)
  questions: QuestionResponseDto[];

  @ApiProperty({ type: Date })
  createdAt?: Date;

  @ApiProperty({ type: Date })
  updatedAt?: Date;

  @ApiProperty({ type: Date })
  deletedAt?: Date;

  @ApiProperty({ type: Number })
  createdBy: number;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  updatedBy?: number | null;
}
