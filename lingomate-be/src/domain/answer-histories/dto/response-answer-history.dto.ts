import { StatusEnum } from "@/common/enums/status.enum";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

export class ResponseAnswerHistoryDto {
  @ApiProperty({ type: String })
  id: string;

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

  @ApiPropertyOptional({
    enum: StatusEnum,
  })
  @IsEnum(StatusEnum)
  @IsOptional()
  status?: StatusEnum | null;

  @ApiProperty({ type: Date })
  createdAt?: Date;

  @ApiProperty({ type: Date })
  updatedAt?: Date;
}
