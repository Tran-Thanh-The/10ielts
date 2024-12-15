import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateUserConversationDto {
  @ApiProperty()
  @IsString()
  conversationId: string;

  @ApiProperty()
  @IsString()
  userId: string;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
