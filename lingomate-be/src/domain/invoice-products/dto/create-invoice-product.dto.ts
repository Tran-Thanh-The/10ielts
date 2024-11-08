import {
  IsOptional,
  IsString, // decorators here
} from "class-validator";

import {
  ApiProperty, // decorators here
} from "@nestjs/swagger";

import {} from // decorators here
"class-validator";

import {} from // decorators here
"@nestjs/swagger";

import {} from // decorators here
"class-validator";

import {} from // decorators here
"@nestjs/swagger";

import {} from // decorators here
"class-validator";

import {} from // decorators here
"@nestjs/swagger";

import {} from // decorators here
"class-validator";

import {} from // decorators here
"@nestjs/swagger";

export class CreateInvoiceProductDto {
  @ApiProperty()
  @IsString()
  courseId: string | null;

  @ApiProperty()
  @IsString()
  practiceId: string | null;

  @ApiProperty()
  @IsString()
  invoiceId: string;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
