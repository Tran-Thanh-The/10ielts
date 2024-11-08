import { StatusEnum } from "@/common/enums/status.enum";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional } from "class-validator";

export class CreateUserQuestionDto {
  // Don't forget to use the class-validator decorators in the DTO properties.
  @ApiProperty({
    type: () => Number,
  })
  @IsNotEmpty()
  user_id: number;

  @ApiProperty({
    type: () => String,
  })
  @IsNotEmpty()
  question_id: string;

  @ApiPropertyOptional({
    type: String,
  })
  @IsOptional()
  answerPick?: string | null;

  @ApiPropertyOptional({
    enum: StatusEnum,
  })
  @IsEnum(StatusEnum)
  @IsOptional()
  status?: StatusEnum;
}
