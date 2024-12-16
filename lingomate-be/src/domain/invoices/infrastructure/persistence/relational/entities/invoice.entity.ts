import { StatusEnum } from "@/common/enums/status.enum";
import { InvoiceProductEntity } from "@/domain/invoice-products/infrastructure/persistence/relational/entities/invoice-product.entity";
import { UserEntity } from "@/domain/users/infrastructure/persistence/relational/entities/user.entity";
import { EntityRelationalHelper } from "@/utils/relational-entity-helper";
import { ApiProperty } from "@nestjs/swagger";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({
  name: "invoice",
})
export class InvoiceEntity extends EntityRelationalHelper {
  @ApiProperty({
    type: Boolean,
    description: "Indicates whether the invoice has been paid",
    default: false,
  })
  @Column({ default: false })
  paymentStatus: boolean;

  @ApiProperty({
    type: Number,
    description: "Unique order code for the invoice",
  })
  @Column({
    unique: true,
    type: "bigint",
  })
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

  @ManyToOne(() => UserEntity, (user) => user.invoices, {
    eager: true,
  })
  @JoinColumn({ name: "userId" })
  user: UserEntity;

  @Column("uuid")
  @Index()
  userId: string;

  @OneToMany(
    () => InvoiceProductEntity,
    (invoiceProduct) => invoiceProduct.invoice,
    {
      cascade: true,
    },
  )
  invoiceProducts: InvoiceProductEntity[];

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
