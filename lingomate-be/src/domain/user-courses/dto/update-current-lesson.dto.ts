import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateCurrentLessonDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  currentLesson: string;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber()
  lastPosition?: number | null;
}
