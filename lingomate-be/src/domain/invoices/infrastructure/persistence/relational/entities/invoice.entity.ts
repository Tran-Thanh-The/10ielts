import { StatusEnum } from "@/common/enums/status.enum";
import { UserInvoicesEntity } from "@/domain/user-invoices/infrastructure/persistence/relational/entities/user-invoices.entity";
import { EntityRelationalHelper } from "@/utils/relational-entity-helper";
import { ApiProperty } from "@nestjs/swagger";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Generated,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({
  name: "invoice",
})
export class InvoiceEntity extends EntityRelationalHelper {
  @ApiProperty({
    type: Number,
    description: "Unique order code for the invoice",
  })
  @Column()
  @Generated("increment")
  orderCode: number;

  @ApiProperty({ type: String })
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty({ type: String })
  @Column()
  name: string;

  @ApiProperty({ type: String })
  @Column({ type: String, nullable: true })
  description?: string | null;

  @ApiProperty({
    type: Number,
    description: "Price of the course in dollars, allowing decimal values",
    example: 49.99,
  })
  @Column("decimal", { precision: 10, scale: 2 })
  money: number;

  @ApiProperty({
    enum: StatusEnum,
  })
  @Column({
    type: "enum",
    enum: StatusEnum,
    default: StatusEnum.IN_ACTIVE,
  })
  status: StatusEnum;

  @OneToMany(() => UserInvoicesEntity, (userInvoice) => userInvoice.user, {
    cascade: true,
  })
  userInvoice: UserInvoicesEntity[];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty()
  @DeleteDateColumn()
  deletedAt: Date;
}
