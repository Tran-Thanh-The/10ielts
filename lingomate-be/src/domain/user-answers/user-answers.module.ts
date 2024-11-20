import { Module } from "@nestjs/common";
import { UserAnswersService } from "./user-answers.service";
import { UserAnswersController } from "./user-answers.controller";
import { RelationalUserAnswerPersistenceModule } from "./infrastructure/persistence/relational/relational-persistence.module";

@Module({
  imports: [RelationalUserAnswerPersistenceModule],
  controllers: [UserAnswersController],
  providers: [UserAnswersService],
  exports: [UserAnswersService, RelationalUserAnswerPersistenceModule],
})
export class UserAnswersModule {}
