import { Items } from "@/utils/dto/request/payos-request-payment.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreatePaymentDto {
  @ApiProperty({
    description: "Amount of money",
    example: 100000,
  })
  @IsNumber()
  amount: number;
  @ApiProperty({
    description: "Description of payment",
    example: "Payment for course",
  })
  @IsString()
  description: string;
  @ApiProperty({
    description: "Items of payment",
    example: [
      {
        name: "Course",
        quantity: 1,
        price: 100000,
      },
    ],
  })
  @IsOptional()
  items?: Items[];
  @ApiProperty()
  @IsString()
  @IsOptional()
  buyerName?: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  buyerEmail?: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  buyerPhone?: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  buyerAddress?: string;
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  expiredAt?: number;
}
