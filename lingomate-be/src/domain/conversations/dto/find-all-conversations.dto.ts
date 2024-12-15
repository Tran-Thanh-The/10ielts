import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";

export class FindAllConversationsDto {
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
