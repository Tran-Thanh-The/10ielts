import { StatusEnum } from "@/common/enums/status.enum";
import { ApiProperty } from "@nestjs/swagger";
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString, // decorators here
} from "class-validator";

export class CreateInvoiceDto {
  @ApiProperty()
  @IsNumber()
  orderCode: number;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  description?: string | null;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  money: number;

  @ApiProperty({
    enum: StatusEnum,
  })
  @IsEnum(StatusEnum)
  status: StatusEnum;
}
