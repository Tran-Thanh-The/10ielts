import { QuestionTypesEnum } from "@/common/enums/question.enum";
import { StatusEnum } from "@/common/enums/status.enum";
import { CategoryEntity } from "@/domain/categories/infrastructure/persistence/relational/entities/category.entity";
import { ApiProperty } from "@nestjs/swagger";

export class Question {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({ type: String })
  title: string;

  @ApiProperty({ type: String })
  description?: string | null;

  @ApiProperty({ type: String })
  audioUrl?: string | null;

  @ApiProperty({ type: Number })
  time?: number | null;

  @ApiProperty({
    enum: QuestionTypesEnum,
  })
  questionType: QuestionTypesEnum;

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
}
