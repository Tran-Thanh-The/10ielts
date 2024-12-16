import { StatusEnum } from "@/common/enums/status.enum";
import { FilesLocalService } from "@/files/infrastructure/uploader/local/files.service";
import { IPaginationOptions } from "@/utils/types/pagination-options";
import { Injectable, NotFoundException } from "@nestjs/common";
import { CategoryRepository } from "../categories/infrastructure/persistence/category.repository";
import { LessonRepository } from "../lessons/infrastructure/persistence/lesson.repository";
import { LessonMapper } from "../lessons/infrastructure/persistence/relational/mappers/lesson.mapper";
import { PracticeExerciseRepository } from "../practice-exercises/infrastructure/persistence/practice-exercise.repository";
import { PracticeExerciseMapper } from "../practice-exercises/infrastructure/persistence/relational/mappers/practice-exercise.mapper";
import { CategoryMapper } from "./../categories/infrastructure/persistence/relational/mappers/category.mapper";
import { Question } from "./domain/question";
import { CreateQuestionDto } from "./dto/create-question.dto";
import { UpdateQuestionDto } from "./dto/update-question.dto";
import { QuestionRepository } from "./infrastructure/persistence/question.repository";
import { QuestionMapper } from "./infrastructure/persistence/relational/mappers/question.mapper";
import { AnswerRepository } from "../answers/infrastructure/persistence/answer.repository";

@Injectable()
export class QuestionsService {
  constructor(
    private readonly questionRepository: QuestionRepository,
    private readonly lessonRepository: LessonRepository,
    private readonly filesLocalService: FilesLocalService,
    private readonly categoryRepository: CategoryRepository,
    private readonly answerRepository: AnswerRepository,
    private readonly practiceExerciseRepository: PracticeExerciseRepository,
  ) {}

  async create(
    userId: string,
    createQuestionDto: CreateQuestionDto,
    fileQuestion: Express.Multer.File,
  ) {
    const model = QuestionMapper.toModel(createQuestionDto);
    model.createdBy = Number(userId);
    console.log("Created question model:", model);

    if (createQuestionDto.category_id) {
      const category = await this.categoryRepository.findById(
        createQuestionDto.category_id,
      );
      if (!category) {
        throw new NotFoundException(
          `Category not found with ID ${createQuestionDto.category_id}`,
        );
      }
      model.category = CategoryMapper.toPersistence(category);
    }

    if (!createQuestionDto.lesson_id && !createQuestionDto.practice_id) {
      throw new NotFoundException(
        "You must provide either a lesson_id or practice_id",
      );
    }

    let position = 1;
    if (createQuestionDto.lesson_id) {
      const lesson = await this.lessonRepository.findById(
        createQuestionDto.lesson_id,
      );
      if (!lesson) {
        throw new NotFoundException(
          `Lesson with ID ${createQuestionDto.lesson_id} not found`,
        );
      }
      model.lesson = LessonMapper.toPersistence(lesson);
      const currentActiveQuestionsCount =
        await this.questionRepository.countActiveQuestionsByLessonId(
          createQuestionDto.lesson_id,
        );
      position = currentActiveQuestionsCount + 1;
      model.position = position;
    }

    if (createQuestionDto.practice_id) {
      const practice = await this.practiceExerciseRepository.findById(
        createQuestionDto.practice_id,
      );
      if (!practice) {
        throw new NotFoundException(
          `Practice with ID ${createQuestionDto.practice_id} not found`,
        );
      }
      model.practice = PracticeExerciseMapper.toPersistence(practice);
      const currentActiveQuestionsCount =
        await this.questionRepository.countActiveQuestionsByPracticeId(
          createQuestionDto.practice_id,
        );
      position = currentActiveQuestionsCount + 1;
      model.position = position;
    }

    model.status = StatusEnum.ACTIVE;

    if (fileQuestion) {
      const uploadedFile = await this.filesLocalService.create(fileQuestion);
      model.file = uploadedFile.file;
    }

    const savedQuestion = await this.questionRepository.create(model);
    return savedQuestion;
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.questionRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findOne(id: Question["id"]) {
    return this.questionRepository.findById(id);
  }

  async update(
    userId: string,
    id: Question["id"],
    updateQuestionDto: UpdateQuestionDto,
    fileQuestion?: Express.Multer.File
  ) {
    const existingQuestion = await this.questionRepository.findById(id);
    if (!existingQuestion) {
      throw new NotFoundException(`Question with id "${id}" not found.`);
    }
    if (fileQuestion) {
      if (existingQuestion.file) {
        // Tách rời file khỏi Question trước khi xóa
        await this.questionRepository.update(id, { file: null });
        await this.filesLocalService.delete(existingQuestion.file);
      }
  
      const uploadedFile = await this.filesLocalService.create(fileQuestion);
      updateQuestionDto.file = uploadedFile.file;
    }
    const updatedData = {
      ...updateQuestionDto,
      updatedBy: Number(userId),
    };

    return this.questionRepository.update(id, updatedData);
  }

  async remove(id: Question["id"]) {
    const question = await this.questionRepository.findById(id);
    if (!question) {
      throw new NotFoundException(
        `No question found for question with id "${id}".`,
      );
    }
    const answers = await this.answerRepository.findByQuestionId(id);
    if (answers && answers.length > 0) {
      for (const answer of answers) {
        await this.answerRepository.remove(answer.id); 
      }
    }
    if (question.lesson) {
      await this.updatePositionAfterDeletion(question.lesson.id, "lesson");
    } else if (question.practice) {
      await this.updatePositionAfterDeletion(question.practice.id, "practice");
    }

    question.status = StatusEnum.IN_ACTIVE;
    await this.questionRepository.save(question);
    return await this.questionRepository.remove(id);
  }

  private async updatePositionAfterDeletion(
    entityId: string,
    entityType: "lesson" | "practice",
  ) {
    const questions =
      entityType === "lesson"
        ? await this.questionRepository.findActiveQuestionsByLessonId(entityId)
        : await this.questionRepository.findActiveQuestionsByPracticeId(
            entityId,
          );

    for (let index = 0; index < questions.length; index++) {
      questions[index].position = index + 1;
      await this.questionRepository.save(questions[index]);
    }
  }

}
