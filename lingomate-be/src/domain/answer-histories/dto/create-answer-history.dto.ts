import { StatusEnum } from "@/common/enums/status.enum";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class CreateAnswerHistoryDto {
  // Don't forget to use the class-validator decorators in the DTO properties.
  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  user_id?: number | null;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  practice_id?: string | null;

  @ApiPropertyOptional({ type: "jsonb" })
  @IsOptional()
  answers?: Record<string, any>;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  lesson_id?: string | null;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  totalScore?: number | null;

  @ApiPropertyOptional({ type: Date })
  @IsOptional()
  startedAt?: Date | null;

  @ApiPropertyOptional({ enum: StatusEnum })
  @IsOptional()
  @IsEnum(StatusEnum)
  status?: StatusEnum;

  @ApiPropertyOptional({ type: () => String })
  @IsOptional()
  writingAnswer?: string;

  @ApiPropertyOptional({ type: () => Number })
  @IsOptional()
  teacherScore?: number;

  @ApiPropertyOptional({ type: () => String })
  @IsOptional()
  teacherFeedback?: string;
}
