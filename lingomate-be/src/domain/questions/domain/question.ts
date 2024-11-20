import {
  QuestionFileTypesEnum,
  QuestionTypesEnum,
} from "@/common/enums/question.enum";
import { StatusEnum } from "@/common/enums/status.enum";
import { Answer } from "@/domain/answers/domain/answer";
import { CategoryEntity } from "@/domain/categories/infrastructure/persistence/relational/entities/category.entity";
import { LessonEntity } from "@/domain/lessons/infrastructure/persistence/relational/entities/lesson.entity";
import { PracticeExerciseEntity } from "@/domain/practice-exercises/infrastructure/persistence/relational/entities/practice-exercise.entity";
import { FileType } from "@/files/domain/file";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class Question {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({ type: String })
  title: string;

  @ApiProperty({ type: String })
  content?: string | null;

  @ApiProperty({ type: String })
  explain?: string | null;

  @ApiProperty({ type: Number })
  position?: number | null;

  @ApiProperty({
    type: () => FileType,
  })
  file?: FileType | null;

  @ApiProperty({ type: Number })
  time?: number | null;

  @ApiProperty({
    enum: QuestionTypesEnum,
  })
  questionType: QuestionTypesEnum;

  @ApiProperty({
    enum: QuestionFileTypesEnum,
  })
  fileType: QuestionFileTypesEnum;

  @ApiPropertyOptional({
    type: () => LessonEntity,
  })
  lesson?: LessonEntity | null;

  @ApiPropertyOptional({
    type: () => PracticeExerciseEntity,
  })
  practice?: PracticeExerciseEntity | null;

  @ApiProperty({
    type: () => CategoryEntity,
  })
  category: CategoryEntity;

  @ApiProperty({
    enum: StatusEnum,
  })
  status: StatusEnum;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: Number })
  createdBy: number;

  @ApiPropertyOptional({ type: Number })
  updatedBy?: number | null;

  @ApiProperty({ type: () => Answer })
  answers: Answer[];
}
