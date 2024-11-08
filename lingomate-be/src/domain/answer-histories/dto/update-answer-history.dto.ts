// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from "@nestjs/swagger";
import { CreateAnswerHistoryDto } from "./create-answer-history.dto";

export class UpdateAnswerHistoryDto extends PartialType(
  CreateAnswerHistoryDto,
) {}
