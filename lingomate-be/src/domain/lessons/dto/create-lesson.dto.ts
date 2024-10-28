import { LessonTypesEnum } from "@/common/enums/lesson.enum";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateLessonDto {
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

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  stars?: number | null;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  totalStars?: number | null;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  isSequence?: boolean | null;
}
