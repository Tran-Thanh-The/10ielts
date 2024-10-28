import { AnswerTypesEnum } from "@/common/enums/answer.enum";
import { StatusEnum } from "@/common/enums/status.enum";
import { QuestionEntity } from "@/domain/questions/infrastructure/persistence/relational/entities/question.entity";
import { FileType } from "@/files/domain/file";
import { ApiProperty } from "@nestjs/swagger";

export class Answer {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({ type: String })
  content?: string | null;

  @ApiProperty({
    enum: AnswerTypesEnum,
  })
  answerType: AnswerTypesEnum;

  @ApiProperty({
    type: () => FileType,
  })
  file?: FileType | null;

  @ApiProperty({ type: Boolean })
  isCorrect?: boolean | null;

  @ApiProperty({
    type: () => QuestionEntity,
  })
  question?: QuestionEntity | null;

  @ApiProperty({
    enum: StatusEnum,
  })
  status: StatusEnum;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
