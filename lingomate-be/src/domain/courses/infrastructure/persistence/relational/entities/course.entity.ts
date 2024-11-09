import { StatusEnum } from "@/common/enums/status.enum";
import { CategoryEntity } from "@/domain/categories/infrastructure/persistence/relational/entities/category.entity";
import { LessonCourseEntity } from "@/domain/lesson-courses/infrastructure/persistence/relational/entities/lesson-course.entity";
import { UserCourseEntity } from "@/domain/user-courses/infrastructure/persistence/relational/entities/user-course.entity";
import { FileEntity } from "@/files/infrastructure/persistence/relational/entities/file.entity";
import { EntityRelationalHelper } from "@/utils/relational-entity-helper";
import { ApiProperty } from "@nestjs/swagger";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { InvoiceEntity } from "@/domain/invoices/infrastructure/persistence/relational/entities/invoice.entity";
import { InvoiceProductEntity } from "@/domain/invoice-products/infrastructure/persistence/relational/entities/invoice-product.entity";

@Entity({
  name: "course",
})
export class CourseEntity extends EntityRelationalHelper {
  @ApiProperty({
    type: String,
    description: "Unique identifier for the course",
  })
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty({
    type: String,
    description: "Name of the course",
    example: "Introduction to Programming",
  })
  @Column()
  name: string;

  @ApiProperty({
    type: Number,
    description: "Price of the course in dollars, allowing decimal values",
    example: 49.99,
  })
  @Column("decimal", { precision: 10, scale: 2 })
  price: number;

  @ApiProperty({
    type: String,
    description: "Brief description of the course",
    example: "This course covers the fundamentals of programming.",
  })
  @Column({ type: String, nullable: true })
  description?: string | null;

  @ApiProperty({
    type: () => FileEntity,
  })
  @OneToOne(() => FileEntity, {
    eager: true,
  })
  @JoinColumn()
  photo?: FileEntity | null;

  @OneToMany(
    () => InvoiceProductEntity,
    (invoiceProducts) => invoiceProducts.course,
    {
      cascade: true,
    },
  )
  invoiceProducts: InvoiceProductEntity[];

  @OneToMany(() => UserCourseEntity, (userCourses) => userCourses.course, {
    cascade: true,
  })
  userCourses: UserCourseEntity[];

  @OneToMany(
    () => LessonCourseEntity,
    (lessonCourses) => lessonCourses.course,
    {
      cascade: true,
    },
  )
  lessonCourses: LessonCourseEntity[];

  @ApiProperty({
    enum: StatusEnum,
  })
  @Column({
    type: "enum",
    enum: StatusEnum,
    default: StatusEnum.IN_ACTIVE,
  })
  status: StatusEnum;

  @ApiProperty({
    type: () => CategoryEntity,
  })
  @ManyToOne(() => CategoryEntity, {
    eager: true,
  })
  category: CategoryEntity;

  @ApiProperty({
    type: Date,
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    type: Date,
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty()
  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date | null;
}
