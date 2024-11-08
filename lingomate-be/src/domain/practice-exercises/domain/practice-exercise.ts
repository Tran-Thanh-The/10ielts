import { DifficultyEnum, PracticeTypeEnum } from "@/common/enums/practice.enum";
import { StatusEnum } from "@/common/enums/status.enum";
import { AnswerHistory } from "@/domain/answer-histories/domain/answer-history";
import { Question } from "@/domain/questions/domain/question";
import { UserEntity } from "@/domain/users/infrastructure/persistence/relational/entities/user.entity";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class PracticeExercise {
  @ApiProperty()
  id: string;

  @ApiProperty({
    type: () => UserEntity,
  })
  user: UserEntity;

  @ApiProperty({ type: () => Question })
  questions?: Question[];

  @ApiProperty({ type: () => AnswerHistory })
  answerHistory: AnswerHistory[];

  @ApiProperty({ type: String })
  title: string;

  @ApiProperty({ type: String })
  description: string;

  @ApiPropertyOptional({
    type: Number,
    description: "Price of the course in dollars, allowing decimal values",
    example: 49.99,
  })
  price?: number | null;

  @ApiProperty({ type: String })
  content: string;

  @ApiProperty({
    enum: PracticeTypeEnum,
  })
  practiceType: PracticeTypeEnum;

  @ApiProperty({
    enum: DifficultyEnum,
  })
  difficulty: DifficultyEnum;

  @ApiProperty({
    enum: StatusEnum,
  })
  status: StatusEnum;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
