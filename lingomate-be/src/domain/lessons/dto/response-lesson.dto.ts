import { LessonTypesEnum } from "@/common/enums/lesson.enum";
import { StatusEnum } from "@/common/enums/status.enum";
import { FileDto } from "@/files/dto/file.dto";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";

export class LessonResponseDto {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  content?: string | null;

  @ApiProperty({
    enum: LessonTypesEnum,
  })
  @IsNotEmpty()
  @IsEnum(LessonTypesEnum)
  lessonType: LessonTypesEnum;

  @ApiProperty({ type: String })
  @IsUUID()
  course_id?: string;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  stars?: number | null;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  totalStars?: number | null;

  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  @IsOptional()
  isSequence?: boolean | null;

  @ApiPropertyOptional({ type: () => FileDto })
  @IsOptional()
  videoUrl?: FileDto | null;

  @ApiPropertyOptional({
    enum: StatusEnum,
  })
  @IsEnum(StatusEnum)
  @IsOptional()
  status?: StatusEnum;
}
