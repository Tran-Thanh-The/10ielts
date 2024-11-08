import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { EntityRelationalHelper } from "@/utils/relational-entity-helper";
import { ApiProperty } from "@nestjs/swagger";
import { CourseEntity } from "@/domain/courses/infrastructure/persistence/relational/entities/course.entity";
import { InvoiceEntity } from "@/domain/invoices/infrastructure/persistence/relational/entities/invoice.entity";
import { PracticeExerciseEntity } from "@/domain/practice-exercises/infrastructure/persistence/relational/entities/practice-exercise.entity";

@Entity({
  name: "invoice_product",
})
export class InvoiceProductEntity extends EntityRelationalHelper {
  @ApiProperty()
  @Column({
    type: "uuid",
    nullable: true,
  })
  @Index()
  courseId: string | null;

  @ManyToOne(
    () => PracticeExerciseEntity,
    (practice) => practice.invoiceProducts,
    {
      eager: true,
    },
  )
  @JoinColumn({ name: "practiceId" })
  practice: PracticeExerciseEntity;

  @ApiProperty()
  @Column({
    type: "uuid",
    nullable: true,
  })
  @Index()
  practiceId: string | null;

  @ManyToOne(() => InvoiceEntity, (invoice) => invoice.invoiceProducts, {
    eager: true,
  })
  @JoinColumn({ name: "invoiceId" })
  invoice: InvoiceEntity;

  @ApiProperty()
  @Column({
    type: "uuid",
  })
  @Index()
  invoiceId: string;

  @ManyToOne(() => CourseEntity, (course) => course.invoiceProducts, {
    eager: true,
  })
  @JoinColumn({ name: "courseId" })
  course: CourseEntity;

  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
