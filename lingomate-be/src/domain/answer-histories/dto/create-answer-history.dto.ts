import { StatusEnum } from "@/common/enums/status.enum";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateAnswerHistoryDto {
  // Don't forget to use the class-validator decorators in the DTO properties.
  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  practice_id?: string | null;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  lesson_id?: string | null;

  @ApiPropertyOptional({ type: Number })
  @IsNumber()
  @IsOptional()
  totalScore?: number | null;

  @ApiPropertyOptional({ type: Date })
  @IsOptional()
  startedAt?: Date;

  @ApiPropertyOptional({ type: Date })
  @IsOptional()
  completedAt?: Date;

  @ApiPropertyOptional({ enum: StatusEnum })
  @IsOptional()
  @IsEnum(StatusEnum)
  status?: StatusEnum;
}
