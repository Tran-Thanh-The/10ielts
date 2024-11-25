import { ConversationTypesEnum } from "@/common/enums/conversation-types.enum";
import { ApiProperty } from "@nestjs/swagger";

export class Conversation {
  @ApiProperty()
  conversationName: string;

  @ApiProperty({
    enum: ConversationTypesEnum,
    default: ConversationTypesEnum.PRIVATE,
  })
  conversationType: ConversationTypesEnum;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
