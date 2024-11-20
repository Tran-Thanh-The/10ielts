import { Module } from "@nestjs/common";
import { UserAnswerRepository } from "../user-answer.repository";
import { UserAnswerRelationalRepository } from "./repositories/user-answer.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserAnswerEntity } from "./entities/user-answer.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UserAnswerEntity])],
  providers: [
    {
      provide: UserAnswerRepository,
      useClass: UserAnswerRelationalRepository,
    },
  ],
  exports: [UserAnswerRepository],
})
export class RelationalUserAnswerPersistenceModule {}
