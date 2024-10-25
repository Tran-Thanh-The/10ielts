import { CreateLessonDto } from "@/domain/lessons/dto/create-lesson.dto";
import { FileDto } from "@/files/dto/file.dto";
import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from "class-validator/types/decorator/decorators";
import { CourseResponseDto } from "./course-response-dto";

export class CourseWithDetailsDTO extends PartialType(CourseResponseDto) {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ example: "John Doe", type: String })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  price: number;

  @ApiProperty({ type: String })
  @IsOptional()
  description?: string | null;

  @ApiPropertyOptional({ type: () => FileDto })
  @IsOptional()
  photo?: FileDto | null;

  @ApiProperty({
    type: String,
  })
  category_id: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Number })
  totalLesson?: number;

  @ApiProperty({ type: Number })
  completedLesson?: number;

  @ApiProperty({ type: Date })
  @Type(() => Boolean)
  isMyCourse?: boolean;

  @ApiProperty({
    type: [CreateLessonDto],
    description: "Array of lessons in the course",
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateLessonDto)
  lessons: CreateLessonDto[];
}
