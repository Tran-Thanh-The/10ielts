import {
  QuestionFileTypesEnum,
  QuestionTypesEnum,
} from "@/common/enums/question.enum";
import { StatusEnum } from "@/common/enums/status.enum";
import { AnswerEntity } from "@/domain/answers/infrastructure/persistence/relational/entities/answer.entity";
import { CategoryEntity } from "@/domain/categories/infrastructure/persistence/relational/entities/category.entity";
import { LessonEntity } from "@/domain/lessons/infrastructure/persistence/relational/entities/lesson.entity";
import { PracticeExerciseEntity } from "@/domain/practice-exercises/infrastructure/persistence/relational/entities/practice-exercise.entity";
import { FileEntity } from "@/files/infrastructure/persistence/relational/entities/file.entity";
import { EntityRelationalHelper } from "@/utils/relational-entity-helper";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({
  name: "question",
})
export class QuestionEntity extends EntityRelationalHelper {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty({ type: String })
  @Column({ type: String })
  title: string;

  @ApiProperty({ type: String })
  @Column({ type: String, nullable: true })
  content?: string | null;

  @ApiProperty({ type: String })
  @Column({ type: String, nullable: true })
  explain?: string | null;

  @ApiProperty({ type: Number })
  @Column({ type: Number, nullable: true })
  position?: number | null;

  @ApiProperty({
    type: () => FileEntity,
  })
  @OneToOne(() => FileEntity, {
    eager: true,
  })
  @JoinColumn()
  file?: FileEntity | null;

  @ApiProperty({ type: Number })
  @Column({ type: Number, nullable: true })
  time?: number | null;

  @ApiProperty({
    enum: QuestionTypesEnum,
  })
  @Column({
    type: "enum",
    enum: QuestionTypesEnum,
  })
  questionType: QuestionTypesEnum;

  @ApiPropertyOptional({
    enum: QuestionFileTypesEnum,
  })
  @Column({
    type: "enum",
    enum: QuestionFileTypesEnum,
    nullable: true,
  })
  fileType?: QuestionFileTypesEnum | null;

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
    type: () => LessonEntity,
  })
  @ManyToOne(() => LessonEntity, (lesson) => lesson.questions)
  lesson?: LessonEntity | null;

  @ApiProperty({
    type: () => AnswerEntity,
  })
  @OneToMany(() => AnswerEntity, (answer) => answer.question, { cascade: true })
  answers: AnswerEntity[];

  @ApiProperty({
    type: () => PracticeExerciseEntity,
  })
  @ManyToOne(() => PracticeExerciseEntity)
  practice?: PracticeExerciseEntity | null;

  @ApiProperty({
    type: () => CategoryEntity,
  })
  @ManyToOne(() => CategoryEntity, {
    eager: true,
  })
  category: CategoryEntity;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ type: Number })
  @Column({ type: Number, nullable: true })
  createdBy: number;

  @ApiPropertyOptional({ type: Number })
  @Column({ type: Number, nullable: true })
  updatedBy?: number | null;
}
