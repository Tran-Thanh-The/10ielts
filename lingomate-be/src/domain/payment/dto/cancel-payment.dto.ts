import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, Validate } from "class-validator";

// Custom validator to allow either string or number
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

@ValidatorConstraint({ name: "isStringOrNumber", async: false })
class IsStringOrNumberConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    return typeof value === "string" || typeof value === "number";
  }

  defaultMessage(args: ValidationArguments) {
    return "orderId must be either a string or a number";
  }
}

export class CancelPaymentDto {
  @ApiProperty()
  @Validate(IsStringOrNumberConstraint)
  orderId: string | number;
  @ApiProperty()
  @IsString()
  @IsOptional()
  cancellationReason?: string;
}
