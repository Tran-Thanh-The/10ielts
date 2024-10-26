import { QuestionTypesEnum } from "@/common/enums/question.enum";
import { StatusEnum } from "@/common/enums/status.enum";
import { AnswerEntity } from "@/domain/answers/infrastructure/persistence/relational/entities/answer.entity";
import { CategoryEntity } from "@/domain/categories/infrastructure/persistence/relational/entities/category.entity";
import { QuestionLessonEntity } from "@/domain/question-lessons/infrastructure/persistence/relational/entities/question-lesson.entity";
import { UserQuestionEntity } from "@/domain/user-questions/infrastructure/persistence/relational/entities/user-question.entity";
import { EntityRelationalHelper } from "@/utils/relational-entity-helper";
import { ApiProperty } from "@nestjs/swagger";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
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
  @Column({ type: String })
  description?: string | null;

  @ApiProperty({ type: String })
  @Column({ type: String })
  audioUrl?: string | null;

  @ApiProperty({ type: Number })
  @Column({ type: Number })
  time?: number | null;

  @ApiProperty({
    enum: QuestionTypesEnum,
  })
  @Column({
    type: "enum",
    enum: QuestionTypesEnum,
  })
  questionType: QuestionTypesEnum;

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
    () => QuestionLessonEntity,
    (questionLesson) => questionLesson.question,
    { cascade: true },
  )
  questionLesson: QuestionLessonEntity[];

  @OneToMany(
    () => UserQuestionEntity,
    (userQuestion) => userQuestion.question,
    { cascade: true },
  )
  userQuestion: UserQuestionEntity[];

  @OneToMany(() => AnswerEntity, (answer) => answer.question, { cascade: true })
  answer: AnswerEntity[];

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
}
