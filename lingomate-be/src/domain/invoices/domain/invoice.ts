import { StatusEnum } from "@/common/enums/status.enum";
import { UserEntity } from "@/domain/users/infrastructure/persistence/relational/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

export class Invoice {
  @ApiProperty({
    type: () => UserEntity,
  })
  user?: UserEntity;

  @ApiProperty()
  paymentStatus: boolean;

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
