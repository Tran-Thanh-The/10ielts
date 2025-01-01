import { FilesGoogleDriveModule } from "@/files/infrastructure/uploader/google-driver/files.module";
import { forwardRef, Module } from "@nestjs/common";
import { QuestionsModule } from "../questions/questions.module";
import { AnswersController } from "./answers.controller";
import { AnswersService } from "./answers.service";
import { RelationalAnswerPersistenceModule } from "./infrastructure/persistence/relational/relational-persistence.module";

@Module({
  imports: [
    forwardRef(() => QuestionsModule),
    RelationalAnswerPersistenceModule,
    FilesGoogleDriveModule,
  ],
  controllers: [AnswersController],
  providers: [AnswersService],
  exports: [AnswersService, RelationalAnswerPersistenceModule],
})
export class AnswersModule {}
