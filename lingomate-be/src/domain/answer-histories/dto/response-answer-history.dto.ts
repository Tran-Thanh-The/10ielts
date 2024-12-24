import { StatusEnum } from "@/common/enums/status.enum";
import { FileDto } from "@/files/dto/file.dto";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

export class ResponseAnswerHistoryDto {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Number })
  user_id: number;

  @ApiPropertyOptional({ type: "jsonb" })
  @IsOptional()
  answers?: Record<string, any>;

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
  startedAt?: Date | null;

  @ApiPropertyOptional({ type: Date })
  @IsOptional()
  completedAt?: Date | null;

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

  @ApiPropertyOptional({ type: () => FileDto })
  @IsOptional()
  audioAnswer?: FileDto | null;

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
