// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from "@nestjs/swagger";
import { CreateConversationDto } from "./create-conversation.dto";

export class UpdateConversationDto extends PartialType(CreateConversationDto) {}
