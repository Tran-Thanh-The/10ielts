import {
  AfterLoad,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { AuthProvidersEnum } from "@/domain/auth/auth-providers.enum";
import { EntityRelationalHelper } from "@/utils/relational-entity-helper";

import { StatusEnum } from "@/common/enums/status.enum";
import { ChatEntity } from "@/domain/chats/infrastructure/persistence/relational/entities/chat.entity";
import { InvoiceEntity } from "@/domain/invoices/infrastructure/persistence/relational/entities/invoice.entity";
import { RoleEntity } from "@/domain/roles/infrastructure/persistence/relational/entities/role.entity";
import { UserCourseEntity } from "@/domain/user-courses/infrastructure/persistence/relational/entities/user-course.entity";
import { UserLessonEntity } from "@/domain/user-lessons/infrastructure/persistence/relational/entities/user-lesson.entity";
import { FileEntity } from "@/files/infrastructure/persistence/relational/entities/file.entity";
import { UserConversationEntity } from "@/domain/user-conversations/infrastructure/persistence/relational/entities/user-conversation.entity";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { AnswerHistoryEntity } from "@/domain/answer-histories/infrastructure/persistence/relational/entities/answer-history.entity";
import { PracticeExerciseEntity } from "@/domain/practice-exercises/infrastructure/persistence/relational/entities/practice-exercise.entity";

@Entity({
  name: "user",
})
export class UserEntity extends EntityRelationalHelper {
  @ApiProperty({
    type: Number,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    type: String,
    example: "john.doe@example.com",
  })
  // For "string | null" we need to use String type.
  // More info: https://github.com/typeorm/typeorm/issues/2567
  @Column({ type: String, unique: true, nullable: true })
  @Expose({ groups: ["me", "admin"] })
  email: string | null;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  password?: string;

  @Exclude({ toPlainOnly: true })
  public previousPassword?: string;

  @AfterLoad()
  public loadPreviousPassword(): void {
    this.previousPassword = this.password;
  }

  @ApiProperty({
    type: String,
    example: "email",
  })
  @Column({ default: AuthProvidersEnum.email })
  @Expose({ groups: ["me", "admin"] })
  provider: string;

  @ApiProperty({
    type: String,
    example: "1234567890",
  })
  @Index()
  @Column({ type: String, nullable: true })
  @Expose({ groups: ["me", "admin"] })
  socialId?: string | null;

  @ApiProperty({
    type: String,
    example: "John Doe",
  })
  @Index()
  @Column({ type: String, nullable: true })
  fullName: string | null;

  @ApiProperty({
    type: () => FileEntity,
  })
  @OneToOne(() => FileEntity, {
    eager: true,
  })
  @JoinColumn()
  photo?: FileEntity | null;

  @ApiProperty({
    type: () => RoleEntity,
  })
  @ManyToOne(() => RoleEntity, {
    eager: true,
  })
  role?: RoleEntity | null;

  @ApiProperty({
    type: Date,
    example: "2021-01-01",
  })
  @Column({ type: Date, nullable: true })
  dob?: Date | null;

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
  createdBy?: number | null;

  @ApiPropertyOptional({ type: Number })
  @Column({ type: Number, nullable: true })
  updatedBy?: number | null;

  @ApiProperty({ type: Number })
  @Column({ type: Number, nullable: true })
  deletedBy?: number | null;

  @OneToMany(() => AnswerHistoryEntity, (answerHistory) => answerHistory.user)
  answerHistories: AnswerHistoryEntity[];

  @OneToMany(() => PracticeExerciseEntity, (practice) => practice.user)
  practices: PracticeExerciseEntity[];

  @OneToMany(() => UserLessonEntity, (userLesson) => userLesson.user)
  userLesson: UserLessonEntity[];

  @OneToMany(() => UserCourseEntity, (userCourse) => userCourse.user)
  userCourse: UserCourseEntity[];

  @OneToMany(() => ChatEntity, (chat) => chat.user, {
    cascade: true,
  })
  chats: ChatEntity[];

  @OneToMany(
    () => UserConversationEntity,
    (userConversation) => userConversation.user,
    {
      cascade: true,
    },
  )
  userConversations: UserConversationEntity[];

  @OneToMany(() => InvoiceEntity, (invoice) => invoice.userId, {
    cascade: true,
  })
  invoices: InvoiceEntity[];
}
