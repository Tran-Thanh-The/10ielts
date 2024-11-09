import { ApiProperty } from "@nestjs/swagger";
import { FileType } from "@/files/domain/file";

export class Chat {
  @ApiProperty({
    type: () => FileType,
  })
  file?: FileType | null;

  @ApiProperty()
  message: string;

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
