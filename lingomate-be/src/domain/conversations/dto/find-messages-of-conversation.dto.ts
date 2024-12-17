import { Chat } from "@/domain/chats/domain/chat";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class FindAllMessageOfConversationRequestDto {
  @ApiProperty({
    default: 1,
  })
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsNumber()
  page: number;

  @ApiProperty({
    default: 25,
  })
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  limit: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? String(value) : null))
  @IsString()
  @IsOptional()
  search?: string;
}

export class MessagesOfConversationResponseDto {
  @ApiProperty()
  data: Chat[];

  @ApiProperty()
  hasNextPage: boolean;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  total: number;
}
