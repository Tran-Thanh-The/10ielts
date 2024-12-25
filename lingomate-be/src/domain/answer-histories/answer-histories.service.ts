import { IPaginationOptions } from "@/utils/types/pagination-options";
import { Injectable, NotFoundException } from "@nestjs/common";
import { LessonRepository } from "../lessons/infrastructure/persistence/lesson.repository";
import { LessonMapper } from "../lessons/infrastructure/persistence/relational/mappers/lesson.mapper";
import { PracticeExerciseRepository } from "../practice-exercises/infrastructure/persistence/practice-exercise.repository";
import { PracticeExerciseMapper } from "../practice-exercises/infrastructure/persistence/relational/mappers/practice-exercise.mapper";
import { AnswerHistory } from "./domain/answer-history";
import { CreateAnswerHistoryDto } from "./dto/create-answer-history.dto";
import { UpdateAnswerHistoryDto } from "./dto/update-answer-history.dto";
import { AnswerHistoryRepository } from "./infrastructure/persistence/answer-history.repository";
import { AnswerHistoryMapper } from "./infrastructure/persistence/relational/mappers/answer-history.mapper";
import { UserRepository } from "../users/infrastructure/persistence/user.repository";
import { UserMapper } from "../users/infrastructure/persistence/relational/mappers/user.mapper";
import { FilesLocalService } from "@/files/infrastructure/uploader/local/files.service";
import { StatusEnum } from "@/common/enums/status.enum";

@Injectable()
export class AnswerHistoriesService {
  constructor(
    private readonly answerHistoryRepository: AnswerHistoryRepository,
    private readonly practiceExerciseRepository: PracticeExerciseRepository,
    private readonly filesLocalService: FilesLocalService,
    private readonly lessonRepository: LessonRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async create(
    userId: string,
    createAnswerHistoryDto: CreateAnswerHistoryDto,
    audioAnswer: Express.Multer.File,
  ) {
    const model = AnswerHistoryMapper.toModel(createAnswerHistoryDto);
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    model.user = UserMapper.toPersistence(user);
    if (createAnswerHistoryDto.practice_id) {
      const practice = await this.practiceExerciseRepository.findById(
        createAnswerHistoryDto.practice_id,
      );
      if (!practice) {
        throw new NotFoundException("Practice not found");
      }
      model.practice = PracticeExerciseMapper.toPersistence(practice);
    }
    if (createAnswerHistoryDto.lesson_id) {
      const lesson = await this.lessonRepository.findById(
        createAnswerHistoryDto.lesson_id,
      );
      if (!lesson) {
        throw new NotFoundException("Lesson not found");
      }
      model.lesson = LessonMapper.toPersistence(lesson);
    }

    if (audioAnswer) {
      const uploadedFile = await this.filesLocalService.create(audioAnswer);
      model.audioAnswer = uploadedFile.file;
    }

    const savedEntity = await this.answerHistoryRepository.create(model);

    return savedEntity;
  }

  async findAllWithPagination({
    paginationOptions,
    practiceId,
    lessonId,
    userId,
  }: {
    paginationOptions: IPaginationOptions;
    practiceId?: string;
    lessonId;
    userId?: string;
  }): Promise<AnswerHistory[]> {
    return this.answerHistoryRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
      practiceId,
      lessonId,
      userId,
    });
  }

  findOne(id: AnswerHistory["id"]) {
    return this.answerHistoryRepository.findById(id);
  }

  async update(
    id: AnswerHistory["id"],
    updateAnswerHistoryDto: UpdateAnswerHistoryDto,
    audioAnswer?: Express.Multer.File,
  ) {
    const existingAnswerHistory =
      await this.answerHistoryRepository.findById(id);
    if (!existingAnswerHistory) {
      throw new NotFoundException(`AnswerHistory with id "${id}" not found.`);
    }
    if (audioAnswer) {
      if (existingAnswerHistory.audioAnswer) {
        await this.answerHistoryRepository.update(id, { audioAnswer: null });
        await this.filesLocalService.delete(existingAnswerHistory.audioAnswer);
      }
      const uploadedFile = await this.filesLocalService.create(audioAnswer);
      updateAnswerHistoryDto.audioAnswer = uploadedFile.file;
    }

    return this.answerHistoryRepository.update(id, updateAnswerHistoryDto);
  }

  async remove(id: AnswerHistory["id"]) {
    const answerHistory = await this.answerHistoryRepository.findById(id);
    if (!answerHistory) {
      throw new NotFoundException(`No answer-history found with id "${id}".`);
    }
    answerHistory.status = StatusEnum.IN_ACTIVE;
    await this.answerHistoryRepository.save(answerHistory);
    return this.answerHistoryRepository.remove(id);
  }
}
