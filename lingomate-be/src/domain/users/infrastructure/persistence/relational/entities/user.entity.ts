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
import { FileEntity } from "../../../../../../files/infrastructure/persistence/relational/entities/file.entity";
import { RoleEntity } from "../../../../../roles/infrastructure/persistence/relational/entities/role.entity";

import { AuthProvidersEnum } from "@/domain/auth/auth-providers.enum";
import { EntityRelationalHelper } from "@/utils/relational-entity-helper";

// We use class-transformer in ORM entity and domain entity.
// We duplicate these rules because you can choose not to use adapters
// in your project and return an ORM entity directly in response.
import { StatusEnum } from "@/common/enums/status.enum";
import { UserCourseEntity } from "@/domain/user-courses/infrastructure/persistence/relational/entities/user-course.entity";
import { UserInvoicesEntity } from "@/domain/user-invoices/infrastructure/persistence/relational/entities/user-invoices.entity";
import { UserLessonEntity } from "@/domain/user-lessons/infrastructure/persistence/relational/entities/user-lesson.entity";
import { UserQuestionEntity } from "@/domain/user-questions/infrastructure/persistence/relational/entities/user-question.entity";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

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
    default: StatusEnum.InActive,
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

  @OneToMany(() => UserInvoicesEntity, (userInvoice) => userInvoice.user)
  userInvoice: UserInvoicesEntity[];

  @OneToMany(() => UserQuestionEntity, (userQuestion) => userQuestion.user)
  userQuestion: UserQuestionEntity[];

  @OneToMany(() => UserLessonEntity, (userLesson) => userLesson.user)
  userLesson: UserLessonEntity[];

  @OneToMany(() => UserCourseEntity, (userCourse) => userCourse.user)
  userCourse: UserCourseEntity[];
}
