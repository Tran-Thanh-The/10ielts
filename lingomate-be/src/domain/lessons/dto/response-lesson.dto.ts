import { LessonTypesEnum } from "@/common/enums/lesson.enum";
import { StatusEnum } from "@/common/enums/status.enum";
import { QuestionResponseDto } from "@/domain/questions/dto/response-question.dto";
import { FileDto } from "@/files/dto/file.dto";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
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
  file?: FileDto | null;

  @ApiPropertyOptional({
    enum: StatusEnum,
  })
  @IsEnum(StatusEnum)
  @IsOptional()
  status?: StatusEnum;

  @ApiProperty({ type: Date })
  createdAt?: Date;

  @ApiProperty({ type: Date })
  updatedAt?: Date;

  @ApiProperty({
    type: [QuestionResponseDto],
    description: "Array of Questions in the lesson",
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionResponseDto)
  questions: QuestionResponseDto[];

  @ApiPropertyOptional({ type: Number, description: "Position of the lesson in the course" })
  @IsOptional()
  position?: number | null;
}
