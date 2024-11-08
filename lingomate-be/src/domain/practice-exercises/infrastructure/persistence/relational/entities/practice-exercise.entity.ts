import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { EntityRelationalHelper } from "@/utils/relational-entity-helper";
import { ApiProperty } from "@nestjs/swagger";
import { UserLessonEntity } from "@/domain/user-lessons/infrastructure/persistence/relational/entities/user-lesson.entity";
import { InvoiceProductEntity } from "@/domain/invoice-products/infrastructure/persistence/relational/entities/invoice-product.entity";

@Entity({
  name: "practice_exercise",
})
export class PracticeExerciseEntity extends EntityRelationalHelper {
  @ApiProperty({
    type: Number,
    description: "Price of the course in dollars, allowing decimal values",
    example: 49.99,
  })
  @Column("decimal", { precision: 10, scale: 2 })
  price: number;

  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToMany(() => UserLessonEntity, (userLesson) => userLesson.practice)
  userLesson: UserLessonEntity[];

  @OneToMany(
    () => InvoiceProductEntity,
    (invoiceProduct) => invoiceProduct.practice,
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
}
