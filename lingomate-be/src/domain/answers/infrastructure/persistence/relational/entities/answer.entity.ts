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
import { EntityRelationalHelper } from "@/utils/relational-entity-helper";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { QuestionEntity } from "@/domain/questions/infrastructure/persistence/relational/entities/question.entity";
import { AnswerTypesEnum } from "@/common/enums/answer.enum";
import { StatusEnum } from "@/common/enums/status.enum";
import { FileEntity } from "@/files/infrastructure/persistence/relational/entities/file.entity";

@Entity({
  name: "answer",
})
export class AnswerEntity extends EntityRelationalHelper {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty({ type: String })
  @Column({ type: String })
  content?: string | null;

  @ApiProperty({
    enum: AnswerTypesEnum,
  })
  @Column({
    type: "enum",
    enum: AnswerTypesEnum,
  })
  answerType: AnswerTypesEnum;

  @ApiProperty({
    type: () => FileEntity,
  })
  @OneToOne(() => FileEntity, {
    eager: true,
  })
  @JoinColumn()
  file?: FileEntity | null;

  @ApiProperty({ type: Boolean })
  @Column({ type: "boolean", default: false })
  isCorrect?: boolean | null;

  @ApiProperty({
    type: () => QuestionEntity,
  })
  @ManyToOne(() => QuestionEntity, {
    eager: true,
  })
  question?: QuestionEntity | null;

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

  @ApiProperty({ type: Number })
  @Column({ type: Number})
  createdBy: number;

  @ApiPropertyOptional({ type: Number })
  @Column({ type: Number })
  updatedBy?: number | null;
}
