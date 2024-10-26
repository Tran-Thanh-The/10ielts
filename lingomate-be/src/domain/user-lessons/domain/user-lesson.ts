import { StatusEnum } from "@/common/enums/status.enum";
import { LessonEntity } from "@/domain/lessons/infrastructure/persistence/relational/entities/lesson.entity";
import { PracticeExerciseEntity } from "@/domain/practice-exercises/infrastructure/persistence/relational/entities/practice-exercise.entity";
import { UserEntity } from "@/domain/users/infrastructure/persistence/relational/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

export class UserLesson {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: () => UserEntity,
  })
  user: UserEntity;

  @ApiProperty({
    type: () => LessonEntity,
  })
  lesson: LessonEntity;

  @ApiProperty({
    type: () => PracticeExerciseEntity,
  })
  practice: PracticeExerciseEntity;

  @ApiProperty({ type: () => Number })
  point?: number | null;

  @ApiProperty({
    enum: StatusEnum,
  })
  status: StatusEnum;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
