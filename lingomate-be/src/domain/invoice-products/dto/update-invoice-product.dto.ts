// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from "@nestjs/swagger";
import { CreateInvoiceProductDto } from "./create-invoice-product.dto";

export class UpdateInvoiceProductDto extends PartialType(
  CreateInvoiceProductDto,
) {}
