// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from "@nestjs/swagger";
import { CreateUserAnswerDto } from "./create-user-answer.dto";

export class UpdateUserAnswerDto extends PartialType(CreateUserAnswerDto) {}
