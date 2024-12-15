import { ApiProperty } from "@nestjs/swagger";

export class UserConversation {
  @ApiProperty()
  conversationId: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
