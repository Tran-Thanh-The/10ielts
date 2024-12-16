import { forwardRef, Module } from "@nestjs/common";
import { QuestionsModule } from "../questions/questions.module";
import { AnswersController } from "./answers.controller";
import { AnswersService } from "./answers.service";
import { RelationalAnswerPersistenceModule } from "./infrastructure/persistence/relational/relational-persistence.module";
import { FilesLocalModule } from "@/files/infrastructure/uploader/local/files.module";

@Module({
  imports: [
    forwardRef(() => QuestionsModule),
    RelationalAnswerPersistenceModule,
    FilesLocalModule,
  ],
  controllers: [AnswersController],
  providers: [AnswersService],
  exports: [AnswersService, RelationalAnswerPersistenceModule],
})
export class AnswersModule {}
