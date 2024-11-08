import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateAnswerHistoryDto } from "./dto/create-answer-history.dto";
import { UpdateAnswerHistoryDto } from "./dto/update-answer-history.dto";
import { AnswerHistoryRepository } from "./infrastructure/persistence/answer-history.repository";
import { IPaginationOptions } from "@/utils/types/pagination-options";
import { AnswerHistory } from "./domain/answer-history";
import { AnswerHistoryMapper } from "./infrastructure/persistence/relational/mappers/answer-history.mapper";
import { PracticeExerciseRepository } from "../practice-exercises/infrastructure/persistence/practice-exercise.repository";
import { LessonRepository } from "../lessons/infrastructure/persistence/lesson.repository";

@Injectable()
export class AnswerHistoriesService {
  constructor(
    private readonly answerHistoryRepository: AnswerHistoryRepository,
    private readonly practiceExerciseRepository: PracticeExerciseRepository,
    private readonly lessonRepository: LessonRepository,
  ) {}

  async create(createAnswerHistoryDto: CreateAnswerHistoryDto) {
    if (createAnswerHistoryDto.practice_id) {
      const practice = await this.practiceExerciseRepository.findById(
        createAnswerHistoryDto.practice_id,
      );
      if (!practice) {
        throw new NotFoundException("Practice not found");
      }
    }
    if (createAnswerHistoryDto.lesson_id) {
      const lesson = await this.lessonRepository.findById(
        createAnswerHistoryDto.lesson_id,
      );
      if (!lesson) {
        throw new NotFoundException("Lesson not found");
      }
    }

    const model = AnswerHistoryMapper.toModel(createAnswerHistoryDto);
    return model;
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.answerHistoryRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findOne(id: AnswerHistory["id"]) {
    return this.answerHistoryRepository.findById(id);
  }

  async update(
    id: AnswerHistory["id"],
    updateAnswerHistoryDto: UpdateAnswerHistoryDto,
  ) {
    const existingAnswerHistory =
      await this.answerHistoryRepository.findById(id);
    if (!existingAnswerHistory) {
      throw new NotFoundException(`AnswerHistory with id "${id}" not found.`);
    }
    return this.answerHistoryRepository.update(id, updateAnswerHistoryDto);
  }

  remove(id: AnswerHistory["id"]) {
    return this.answerHistoryRepository.remove(id);
  }
}
