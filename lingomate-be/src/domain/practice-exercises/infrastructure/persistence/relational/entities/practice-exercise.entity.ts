import { DifficultyEnum, PracticeTypeEnum } from "@/common/enums/practice.enum";
import { StatusEnum } from "@/common/enums/status.enum";
import { AnswerHistoryEntity } from "@/domain/answer-histories/infrastructure/persistence/relational/entities/answer-history.entity";
import { InvoiceProductEntity } from "@/domain/invoice-products/infrastructure/persistence/relational/entities/invoice-product.entity";
import { QuestionEntity } from "@/domain/questions/infrastructure/persistence/relational/entities/question.entity";
import { UserEntity } from "@/domain/users/infrastructure/persistence/relational/entities/user.entity";
import { EntityRelationalHelper } from "@/utils/relational-entity-helper";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({
  name: "practice_exercise",
})
export class PracticeExerciseEntity extends EntityRelationalHelper {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty({
    type: () => UserEntity,
  })
  @ManyToOne(() => UserEntity, {
    eager: true,
  })
  user: UserEntity;

  @ApiProperty({
    type: () => QuestionEntity,
  })
  @OneToMany(() => QuestionEntity, (question) => question.practice)
  questions: QuestionEntity[];

  @ApiProperty({
    type: () => AnswerHistoryEntity,
  })
  @OneToMany(
    () => AnswerHistoryEntity,
    (answerHistory) => answerHistory.practice,
  )
  answerHistories: AnswerHistoryEntity[];

  @ApiProperty({ type: String })
  @Column({ type: String, nullable: true })
  title: string;

  @ApiProperty({ type: String })
  @Column({ type: String, nullable: true })
  description: string;

  @ApiPropertyOptional({
    type: Number,
    description: "Price of the course in dollars, allowing decimal values",
    example: 49.99,
  })
  @Column({
    type: "decimal",
    precision: 10,
    scale: 2,
    nullable: true,
  })
  price: number | null;

  @ApiProperty({ type: String })
  @Column({ type: String, nullable: true })
  content: string;

  @ApiProperty({
    enum: PracticeTypeEnum,
  })
  @Column({
    type: "enum",
    enum: PracticeTypeEnum,
  })
  practiceType: PracticeTypeEnum;

  @ApiProperty({
    enum: DifficultyEnum,
  })
  @Column({
    type: "enum",
    enum: DifficultyEnum,
  })
  difficulty: DifficultyEnum;

  @ApiProperty({
    enum: StatusEnum,
  })
  @Column({
    type: "enum",
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
  })
  status: StatusEnum;

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

  @ApiProperty()
  @DeleteDateColumn()
  deletedAt: Date;

  @ApiProperty({ type: Number })
  @Column({ type: Number, nullable: true })
  createdBy: number;

  @ApiPropertyOptional({ type: Number })
  @Column({ type: Number, nullable: true })
  updatedBy?: number | null;
}
