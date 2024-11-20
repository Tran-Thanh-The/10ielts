import { StatusEnum } from "@/common/enums/status.enum";
import { Lesson } from "@/domain/lessons/domain/lesson";
import { PracticeExercise } from "@/domain/practice-exercises/domain/practice-exercise";
import { UserEntity } from "@/domain/users/infrastructure/persistence/relational/entities/user.entity";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class AnswerHistory {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: () => UserEntity,
  })
  user: UserEntity;

  @ApiProperty({
    type: () => PracticeExercise,
  })
  practice: PracticeExercise;

  @ApiProperty({
    type: () => Lesson,
  })
  lesson: Lesson;

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
