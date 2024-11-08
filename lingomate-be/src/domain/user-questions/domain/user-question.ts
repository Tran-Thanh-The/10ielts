import { StatusEnum } from "@/common/enums/status.enum";
import { QuestionEntity } from "@/domain/questions/infrastructure/persistence/relational/entities/question.entity";
import { UserEntity } from "@/domain/users/infrastructure/persistence/relational/entities/user.entity";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class UserQuestion {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: () => UserEntity,
  })
  user: UserEntity;

  @ApiProperty({
    type: () => QuestionEntity,
  })
  question: QuestionEntity;

  @ApiProperty({
    enum: StatusEnum,
  })
  status: StatusEnum;

  @ApiPropertyOptional({
    type: String,
  })
  answerPick?: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
