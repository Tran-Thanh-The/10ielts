// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from "@nestjs/swagger";
import { CreateUserConversationDto } from "./create-user-conversation.dto";

export class UpdateUserConversationDto extends PartialType(
  CreateUserConversationDto,
) {}
