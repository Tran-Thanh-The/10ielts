import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { EntityRelationalHelper } from "@/utils/relational-entity-helper";
import { ApiProperty } from "@nestjs/swagger";
import { AnswerHistoryEntity } from "@/domain/answer-histories/infrastructure/persistence/relational/entities/answer-history.entity";
import { QuestionEntity } from "@/domain/questions/infrastructure/persistence/relational/entities/question.entity";
import { StatusEnum } from "@/common/enums/status.enum";

@Entity({
  name: "user_answer",
})
export class UserAnswerEntity extends EntityRelationalHelper {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @ApiProperty({
    type: () => AnswerHistoryEntity,
  })
  @ManyToOne(() =>  AnswerHistoryEntity, {
    eager: true,
  })
  answerHistory: AnswerHistoryEntity;

  @ApiProperty({
    type: () => QuestionEntity,
  })
  @ManyToOne(() => QuestionEntity, {
    eager: true,
  })
  question: QuestionEntity;

  @ApiProperty({ type: String })
  @Column({ type: String, nullable: true })
  answerPick?: string | null;

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
}
