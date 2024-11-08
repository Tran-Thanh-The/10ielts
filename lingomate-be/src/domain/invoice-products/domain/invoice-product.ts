import { ApiProperty } from "@nestjs/swagger";

export class InvoiceProduct {
  @ApiProperty()
  courseId: string | null;

  @ApiProperty()
  practiceId: string | null;

  @ApiProperty()
  invoiceId: string;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
