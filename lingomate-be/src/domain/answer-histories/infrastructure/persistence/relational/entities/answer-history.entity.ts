import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { EntityRelationalHelper } from "@/utils/relational-entity-helper";
import { ApiProperty } from "@nestjs/swagger";
import { PracticeExerciseEntity } from "@/domain/practice-exercises/infrastructure/persistence/relational/entities/practice-exercise.entity";
import { LessonEntity } from "@/domain/lessons/infrastructure/persistence/relational/entities/lesson.entity";
import { StatusEnum } from "@/common/enums/status.enum";
import { UserAnswerEntity } from "@/domain/user-answers/infrastructure/persistence/relational/entities/user-answer.entity";
import { UserEntity } from "@/domain/users/infrastructure/persistence/relational/entities/user.entity";

@Entity({
  name: "answer_history",
})
export class AnswerHistoryEntity extends EntityRelationalHelper {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty({
    type: () => UserAnswerEntity,
  })
  @OneToMany(
    () => UserAnswerEntity,
    (userAnswer) => userAnswer.answerHistory,
    { cascade: true },
  )
  userAnswers: UserAnswerEntity[];

  @ApiProperty({
    type: () => UserEntity,
  })
  @ManyToOne(() => UserEntity, {
    eager: true,
  })
  user: UserEntity;

  @ApiProperty({
    type: () => PracticeExerciseEntity,
  })
  @ManyToOne(() => PracticeExerciseEntity, {
    eager: true,
  })
  practice: PracticeExerciseEntity;

  @ApiProperty({
    type: () => LessonEntity,
  })
  @ManyToOne(() => LessonEntity, {
    eager: true,
  })
  lesson: LessonEntity;

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
    enum: StatusEnum,
  })
  @Column({
    type: "enum",
    enum: StatusEnum,
    default: StatusEnum.IN_ACTIVE,
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
