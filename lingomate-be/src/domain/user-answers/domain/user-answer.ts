import { StatusEnum } from "@/common/enums/status.enum";
import { AnswerHistoryEntity } from "@/domain/answer-histories/infrastructure/persistence/relational/entities/answer-history.entity";
import { QuestionEntity } from "@/domain/questions/infrastructure/persistence/relational/entities/question.entity";
import { ApiProperty } from "@nestjs/swagger";

export class UserAnswer {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: () => AnswerHistoryEntity,
  })
  answerHistory: AnswerHistoryEntity;

  @ApiProperty({
    type: () => QuestionEntity,
  })
  question: QuestionEntity;

  @ApiProperty({ type: String })
  answerPick?: string | null;

  @ApiProperty({
    enum: StatusEnum,
  })
  status: StatusEnum;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
