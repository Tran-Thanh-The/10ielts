import { StatusEnum } from "@/common/enums/status.enum";
import { ApiProperty } from "@nestjs/swagger";

export class Invoice {
  @ApiProperty({
    type: Number,
  })
  orderCode: number;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  description?: string | null;

  @ApiProperty({ type: Number })
  money: number;

  @ApiProperty({
    enum: StatusEnum,
  })
  status: StatusEnum;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;
}
