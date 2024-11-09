import { FileDto } from "@/files/dto/file.dto";
import { ApiProperty } from "@nestjs/swagger";

export class ChatResponseDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  message: string;
  @ApiProperty()
  conversationId: string;
  @ApiProperty()
  userId: string;
  @ApiProperty({ type: Date })
  createdAt?: Date;
  @ApiProperty({ type: Date })
  updatedAt?: Date;
  @ApiProperty()
  file?: FileDto | null;
}
