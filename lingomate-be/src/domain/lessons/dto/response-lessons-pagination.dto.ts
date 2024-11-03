import { ApiProperty } from "@nestjs/swagger";
import { LessonResponseDto } from "./response-lesson.dto";

export class LessonListResponseDto<T = LessonResponseDto> {
  @ApiProperty({ type: [LessonResponseDto] })
  data: T[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;
}
