import { IsString } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

export class CreateChatDto {
  @ApiProperty()
  @IsString()
  message: string;

  @ApiProperty()
  @IsString()
  conversationId: string;
}
