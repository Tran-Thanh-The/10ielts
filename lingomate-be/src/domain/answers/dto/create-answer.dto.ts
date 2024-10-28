import { AnswerTypesEnum } from "@/common/enums/answer.enum";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional } from "class-validator";

export class CreateAnswerDto {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  content?: string | null;

  @ApiProperty({
    enum: AnswerTypesEnum,
  })
  @IsNotEmpty()
  @IsEnum(AnswerTypesEnum)
  answerType: AnswerTypesEnum;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  isCorrect?: boolean | null;
}
