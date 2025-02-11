import { StatusEnum } from "@/common/enums/status.enum";
import { LessonEntity } from "@/domain/lessons/infrastructure/persistence/relational/entities/lesson.entity";
import { PracticeExerciseEntity } from "@/domain/practice-exercises/infrastructure/persistence/relational/entities/practice-exercise.entity";
import { UserEntity } from "@/domain/users/infrastructure/persistence/relational/entities/user.entity";
import { FileEntity } from "@/files/infrastructure/persistence/relational/entities/file.entity";
import { EntityRelationalHelper } from "@/utils/relational-entity-helper";
import { ApiProperty } from "@nestjs/swagger";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({
  name: "answer_history",
})
export class AnswerHistoryEntity extends EntityRelationalHelper {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty()
  @Column({
    type: "jsonb",
    nullable: true,
  })
  answers?: Record<string, any>;

  @ApiProperty()
  @Column({
    type: "jsonb",
    nullable: true,
  })
  aiReview?: Record<string, any>;

  @ApiProperty({
    type: () => UserEntity,
  })
  @ManyToOne(() => UserEntity, {
    eager: true,
  })
  user?: UserEntity;

  @ApiProperty({
    type: () => PracticeExerciseEntity,
  })
  @ManyToOne(() => PracticeExerciseEntity, {
    eager: true,
  })
  practice?: PracticeExerciseEntity;

  @ApiProperty({
    type: () => LessonEntity,
  })
  @ManyToOne(() => LessonEntity, {
    eager: true,
  })
  lesson?: LessonEntity;

  @ApiProperty({ type: () => Number })
  @Column({
    type: "decimal",
    precision: 5,
    scale: 2,
    nullable: true,
    default: 0,
  })
  totalScore?: number | null;

  @ApiProperty({
    type: () => FileEntity,
  })
  @OneToOne(() => FileEntity, {
    eager: true,
  })
  @JoinColumn()
  audioAnswer?: FileEntity | null;

  @ApiProperty({ type: () => String })
  @Column({ type: "text", nullable: true })
  writingAnswer?: string;

  @ApiProperty({ type: () => Number })
  @Column({ type: "decimal", precision: 5, scale: 2, nullable: true })
  teacherScore?: number;

  @ApiProperty({ type: () => String })
  @Column({ type: "text", nullable: true })
  teacherFeedback?: string;

  @ApiProperty({
    enum: StatusEnum,
  })
  @Column({
    type: "enum",
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
  })
  status: StatusEnum;

  @ApiProperty()
  @Column({
    type: "timestamp with time zone",
    nullable: true,
  })
  startedAt?: Date | null;

  @ApiProperty()
  @Column({
    type: "timestamp with time zone",
    nullable: true,
  })
  completedAt?: Date | null;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
