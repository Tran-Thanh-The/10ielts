import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateUserCourseDto {
  @ApiProperty({
    type: () => String,
  })
  user_id: string;

  @ApiProperty({
    type: () => String,
  })
  @IsNotEmpty()
  course_id: string;

  @ApiPropertyOptional({
    type: () => String,
  })
  @IsOptional()
  currentLesson?: string | null;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  lastPosition?: number | null;
}
