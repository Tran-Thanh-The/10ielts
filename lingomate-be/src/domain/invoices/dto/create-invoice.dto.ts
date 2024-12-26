import { StatusEnum } from "@/common/enums/status.enum";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString, // decorators here
} from "class-validator";

import {} from // decorators here
"class-validator";

import {} from // decorators here
"@nestjs/swagger";

export class CreateInvoiceDto {
  @ApiProperty()
  @IsBoolean()
  paymentStatus: boolean;

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
    default: StatusEnum.ACTIVE,
  })
  @IsEnum(StatusEnum)
  @IsOptional()
  status: StatusEnum;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  userId?: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  courseId: string;
}
