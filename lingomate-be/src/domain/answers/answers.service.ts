import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateAnswerDto } from "./dto/create-answer.dto";
import { UpdateAnswerDto } from "./dto/update-answer.dto";
import { AnswerRepository } from "./infrastructure/persistence/answer.repository";
import { IPaginationOptions } from "@/utils/types/pagination-options";
import { Answer } from "./domain/answer";
import { AnswerMapper } from "./infrastructure/persistence/relational/mappers/answer.mapper";
import { QuestionRepository } from "../questions/infrastructure/persistence/question.repository";
import { FilesLocalService } from "@/files/infrastructure/uploader/local/files.service";
import { StatusEnum } from "@/common/enums/status.enum";
import { QuestionMapper } from "../questions/infrastructure/persistence/relational/mappers/question.mapper";

@Injectable()
export class AnswersService {
  constructor(
    private readonly answerRepository: AnswerRepository,
    private readonly questionRepository: QuestionRepository,
    private readonly filesLocalService: FilesLocalService,
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
      const uploadedFile = await this.filesLocalService.create(fileAnswer);
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
    updateAnswerDto: UpdateAnswerDto) {
    const existingAnswer = await this.answerRepository.findById(id);
    if (!existingAnswer) {
      throw new NotFoundException(`Answer with id "${id}" not found.`)
    }

    const updatedData = {
      ...updateAnswerDto,
      updatedBy: Number(userId),
    }
    return this.answerRepository.update(id, updatedData);
  }

  remove(id: Answer["id"]) {
    return this.answerRepository.remove(id);
  }
}
