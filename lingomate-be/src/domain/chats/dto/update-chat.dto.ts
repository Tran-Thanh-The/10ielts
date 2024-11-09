// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from "@nestjs/swagger";
import { CreateChatDto } from "./create-chat.dto";

export class UpdateChatDto extends PartialType(CreateChatDto) {}
