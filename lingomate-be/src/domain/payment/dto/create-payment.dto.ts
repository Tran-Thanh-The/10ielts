import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString } from "class-validator";

enum ProductType {
  COURSE = "course",
  PRACTICE = "practice",
}

export class CreatePaymentDto {
  @ApiProperty({
    enum: ProductType,
    default: ProductType.COURSE,
  })
  @IsEnum(ProductType)
  type: ProductType;

  @ApiProperty()
  @IsString()
  id: string;
}
