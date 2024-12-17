import { StatusEnum } from "@/common/enums/status.enum";
import { Lesson } from "@/domain/lessons/domain/lesson";
import { LessonEntity } from "@/domain/lessons/infrastructure/persistence/relational/entities/lesson.entity";
import { PracticeExerciseEntity } from "@/domain/practice-exercises/infrastructure/persistence/relational/entities/practice-exercise.entity";
import { UserEntity } from "@/domain/users/infrastructure/persistence/relational/entities/user.entity";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class AnswerHistory {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  answers?: Record<string, any>;

  @ApiProperty({
    type: () => UserEntity,
  })
  user?: UserEntity;

  @ApiProperty({
    type: () => PracticeExerciseEntity,
  })
  practice?: PracticeExerciseEntity;

  @ApiProperty({
    type: () => LessonEntity,
  })
  lesson?: LessonEntity;

  @ApiProperty({ type: () => Number })
  totalScore?: number | null;

  @ApiProperty({
    enum: StatusEnum,
  })
  status: StatusEnum;

  @ApiPropertyOptional()
  @IsOptional()
  startedAt?: Date | null;

  @ApiPropertyOptional()
  @IsOptional()
  completedAt?: Date | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
