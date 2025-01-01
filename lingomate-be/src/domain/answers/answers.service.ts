import { StatusEnum } from "@/common/enums/status.enum";
import { IPaginationOptions } from "@/utils/types/pagination-options";
import { Injectable, NotFoundException } from "@nestjs/common";
import { QuestionRepository } from "../questions/infrastructure/persistence/question.repository";
import { QuestionMapper } from "../questions/infrastructure/persistence/relational/mappers/question.mapper";
import { Answer } from "./domain/answer";
import { CreateAnswerDto } from "./dto/create-answer.dto";
import { UpdateAnswerDto } from "./dto/update-answer.dto";
import { AnswerRepository } from "./infrastructure/persistence/answer.repository";
import { AnswerMapper } from "./infrastructure/persistence/relational/mappers/answer.mapper";
import { FilesGoogleDriveService } from "@/files/infrastructure/uploader/google-driver/files.service";

@Injectable()
export class AnswersService {
  constructor(
    private readonly answerRepository: AnswerRepository,
    private readonly questionRepository: QuestionRepository,
    private readonly filesGoogleDrivelService: FilesGoogleDriveService,
  ) {}

  async create(
    userId: number,
    questionId: string,
    createAnswerDto: CreateAnswerDto,
    fileAnswer: Express.Multer.File,
  ) {
    const question = await this.questionRepository.findById(questionId);

    if (!question) {
      throw new NotFoundException(
        `Question not found for answer with ID ${questionId}`,
      );
    }
    const model = AnswerMapper.toModel(createAnswerDto);
    model.createdBy = Number(userId);
    model.status = StatusEnum.ACTIVE;
    model.question = QuestionMapper.toPersistence(question);
    if (fileAnswer) {
      const uploadedFile =
        await this.filesGoogleDrivelService.create(fileAnswer);
      model.file = uploadedFile.file;
    }
    return await this.answerRepository.create(model);
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.answerRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findOne(id: Answer["id"]) {
    return this.answerRepository.findById(id);
  }

  async update(
    userId: string,
    id: Answer["id"],
    updateAnswerDto: UpdateAnswerDto,
    fileAnswer?: Express.Multer.File,
  ) {
    const existingAnswer = await this.answerRepository.findById(id);
    if (!existingAnswer) {
      throw new NotFoundException(`Answer with id "${id}" not found.`);
    }

    if (fileAnswer) {
      if (existingAnswer.file) {
        // Tách rời file khỏi Answer trước khi xóa
        await this.answerRepository.update(id, { file: null });
        await this.filesGoogleDrivelService.delete(existingAnswer.file);
      }

      const uploadedFile =
        await this.filesGoogleDrivelService.create(fileAnswer);
      updateAnswerDto.file = uploadedFile.file;
    }
    const updatedData = {
      ...updateAnswerDto,
      updatedBy: Number(userId),
    };
    return this.answerRepository.update(id, updatedData);
  }

  async remove(id: Answer["id"]) {
    const answer = await this.answerRepository.findById(id);
    if (!answer) {
      throw new NotFoundException("Answer not found");
    }
    await this.answerRepository.remove(id);
    if (answer.file) {
      try {
        await this.filesGoogleDrivelService.delete(answer.file);
      } catch (error) {
        console.error(
          `Failed to delete file on Google Drive: ${error.message}`,
        );
        console.warn(
          "File deletion failed but answer was removed successfully",
        );
      }
    }
    return true;
  }
}
