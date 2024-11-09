import { LessonTypesEnum } from "@/common/enums/lesson.enum";
import { StatusEnum } from "@/common/enums/status.enum";
import { LessonCourse } from "@/domain/lesson-courses/domain/lesson-course";
import { Question } from "@/domain/questions/domain/question";
import { FileType } from "@/files/domain/file";
import { ApiProperty } from "@nestjs/swagger";

export class Lesson {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: String,
  })
  title: string;

  @ApiProperty({
    type: String,
  })
  content?: string | null;

  @ApiProperty({
    type: () => FileType,
  })
  file?: FileType | null;

  @ApiProperty({
    enum: LessonTypesEnum,
  })
  lessonType: LessonTypesEnum;

  @ApiProperty({ type: Number })
  stars?: number | null;

  @ApiProperty({ type: Number })
  totalStars?: number | null;

  @ApiProperty({ type: Boolean })
  isSequence?: boolean | null;

  @ApiProperty({
    enum: StatusEnum,
  })
  status: StatusEnum;

  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt?: Date | null;

  @ApiProperty({ type: () => Question })
  questions?: Question[];

  @ApiProperty({ type: () => LessonCourse })
  lessonCourses?: LessonCourse[];
}
