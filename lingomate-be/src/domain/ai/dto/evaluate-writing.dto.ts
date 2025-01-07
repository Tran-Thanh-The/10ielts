import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class EvaluateWritingDto {
  @ApiProperty()
  @IsString()
  topic: string;

  @ApiProperty()
  @IsString()
  writingAssignmentSubmission: string;
}
