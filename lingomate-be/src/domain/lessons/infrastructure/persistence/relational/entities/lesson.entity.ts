import { LessonTypesEnum } from "@/common/enums/lesson.enum";
import { StatusEnum } from "@/common/enums/status.enum";
import { LessonCourseEntity } from "@/domain/lesson-courses/infrastructure/persistence/relational/entities/lesson-course.entity";
import { QuestionEntity } from "@/domain/questions/infrastructure/persistence/relational/entities/question.entity";
import { UserLessonEntity } from "@/domain/user-lessons/infrastructure/persistence/relational/entities/user-lesson.entity";
import { FileEntity } from "@/files/infrastructure/persistence/relational/entities/file.entity";
import { EntityRelationalHelper } from "@/utils/relational-entity-helper";
import { ApiProperty } from "@nestjs/swagger";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({
  name: "lesson",
})
export class LessonEntity extends EntityRelationalHelper {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty({
    type: String,
  })
  @Column({ type: String })
  title: string;

  @ApiProperty({
    type: String,
  })
  @Column({ type: String, nullable: true })
  content?: string | null;

  @ApiProperty({
    type: () => FileEntity,
  })
  @OneToOne(() => FileEntity, {
    eager: true,
  })
  @JoinColumn()
  file?: FileEntity | null;

  @ApiProperty({
    enum: LessonTypesEnum,
  })
  @Column({
    type: "enum",
    enum: LessonTypesEnum,
  })
  lessonType: LessonTypesEnum;

  @ApiProperty({
    enum: StatusEnum,
  })
  @Column({
    type: "enum",
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
  })
  status: StatusEnum;

  @OneToMany(() => QuestionEntity, (question) => question.lesson, {
    cascade: ["insert", "update"],
  })
  questions: QuestionEntity[];

  @OneToMany(() => UserLessonEntity, (userLesson) => userLesson.lesson, {
    cascade: true,
  })
  userLessons: UserLessonEntity[];

  @OneToMany(
    () => LessonCourseEntity,
    (lessonCourses) => lessonCourses.lesson,
    {
      cascade: true,
    },
  )
  lessonCourses: LessonCourseEntity[];

  @ApiProperty({ type: Number })
  @Column({
    type: "decimal",
    precision: 5,
    scale: 2,
    nullable: true,
    default: 0,
  })
  stars?: number | null;

  @ApiProperty({ type: Number })
  @Column({ type: "int", nullable: true, default: 3 })
  totalStars?: number | null;

  @ApiProperty({ type: Boolean })
  @Column({ type: "boolean", nullable: true, default: false })
  isSequence?: boolean | null;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty()
  @DeleteDateColumn()
  deletedAt?: Date | null;
}
