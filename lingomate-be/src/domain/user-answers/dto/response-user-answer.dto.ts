import { StatusEnum } from "@/common/enums/status.enum";
import { Question } from "@/domain/questions/domain/question";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";

export class UserAnswerResponseDto {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  answerHistoryId: string;

  @ApiProperty({ type: () => Question })
  question: Question;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  answerPick?: string | null;

  @ApiProperty({
    enum: StatusEnum,
  })
  @IsEnum(StatusEnum)
  status: StatusEnum;

  @ApiProperty({ type: Date })
  createdAt?: Date;

  @ApiProperty({ type: Date })
  updatedAt?: Date;
}
