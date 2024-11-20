import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class CreateUserAnswerDto {
  // Don't forget to use the class-validator decorators in the DTO properties.
  @ApiProperty({ type: String })
  answerHistoryId: string;

  @ApiProperty({ type: String })
  question_id: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  answerPick?: string | null;
}
