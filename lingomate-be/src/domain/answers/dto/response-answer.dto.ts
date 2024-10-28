import { AnswerTypesEnum } from "@/common/enums/answer.enum";
import { StatusEnum } from "@/common/enums/status.enum";
import { QuestionResponseDto } from "@/domain/questions/dto/response-question.dto";
import { FileDto } from "@/files/dto/file.dto";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";

export class AnswerResponseDto {
  @ApiProperty({ type: String })
  id: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  content?: string | null;

  @ApiProperty({
    enum: AnswerTypesEnum,
  })
  @IsNotEmpty()
  @IsEnum(AnswerTypesEnum)
  answerType: AnswerTypesEnum;

  @ApiPropertyOptional({ type: () => FileDto })
  @IsOptional()
  file?: FileDto | null;

  @ApiPropertyOptional({ type: () => Boolean })
  @IsOptional()
  isCorrect?: boolean | null;

  @ApiProperty({
    type: () => QuestionResponseDto,
  })
  @IsNotEmpty()
  question: QuestionResponseDto;

  @ApiProperty({
    enum: StatusEnum,
  })
  @IsEnum(StatusEnum)
  status: StatusEnum;

  @ApiProperty({ type: Date })
  createdAt?: Date;

  @ApiProperty({ type: Date })
  updatedAt?: Date;
}
