import { StatusEnum } from "@/common/enums/status.enum";
import { FilesLocalService } from "@/files/infrastructure/uploader/local/files.service";
import { IPaginationOptions } from "@/utils/types/pagination-options";
import { Injectable, NotFoundException } from "@nestjs/common";
import { CategoryRepository } from "../categories/infrastructure/persistence/category.repository";
import { LessonCourseRepository } from "../lesson-courses/infrastructure/persistence/lesson-course.repository";
import { LessonRepository } from "../lessons/infrastructure/persistence/lesson.repository";
import { LessonMapper } from "../lessons/infrastructure/persistence/relational/mappers/lesson.mapper";
import { CategoryMapper } from "./../categories/infrastructure/persistence/relational/mappers/category.mapper";
import { Question } from "./domain/question";
import { CreateQuestionDto } from "./dto/create-question.dto";
import { UpdateQuestionDto } from "./dto/update-question.dto";
import { QuestionRepository } from "./infrastructure/persistence/question.repository";
import { QuestionMapper } from "./infrastructure/persistence/relational/mappers/question.mapper";

@Injectable()
export class QuestionsService {
  constructor(
    private readonly questionRepository: QuestionRepository,
    private readonly lessonRepository: LessonRepository,
    private readonly filesLocalService: FilesLocalService,
    private readonly categoryRepository: CategoryRepository,
    private readonly lessonCourseRepository: LessonCourseRepository,
  ) {}

  async create(
    lessonId,
    createQuestionDto: CreateQuestionDto,
    fileQuestion: Express.Multer.File,
  ) {
    const course =
      await this.lessonCourseRepository.findCourseByLessonId(lessonId);

    if (!course) {
      throw new NotFoundException(
        `Course not found for Lesson with ID ${lessonId}`,
      );
    }
    const category = await this.categoryRepository.findByCourseId(course.id);
    if (!category) {
      throw new NotFoundException(
        `Category not found for Course with ID ${course.id}`,
      );
    }
    const lesson = await this.lessonRepository.findById(lessonId);
    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${lessonId} not found`);
    }
    const model = QuestionMapper.toModel(createQuestionDto);
    console.log("Created question model:", model);

    model.category = CategoryMapper.toPersistence(category);
    model.lesson = LessonMapper.toPersistence(lesson);
    model.status = StatusEnum.ACTIVE;
    if (fileQuestion) {
      const uploadedFile = await this.filesLocalService.create(fileQuestion);
      model.file = uploadedFile.file;
    }
    const currentActiveQuestionsCount =
      await this.questionRepository.countActiveQuestionsByLessonId(lessonId);
    model.position = currentActiveQuestionsCount + 1;
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

  async update(id: Question["id"], updateQuestionDto: UpdateQuestionDto) {
    const existingQuestion = await this.questionRepository.findById(id);
    if (!existingQuestion) {
      throw new NotFoundException(`Question with id "${id}" not found.`);
    }

    return this.questionRepository.update(id, updateQuestionDto);
  }

  async remove(id: Question["id"]) {
    const question = await this.questionRepository.findById(id);
    if (!question) {
      throw new NotFoundException(
        `No question found for question with id "${id}".`,
      );
    }
    const lessonId = question?.lesson?.id;
    console.log(question);
    question.status = StatusEnum.IN_ACTIVE;
    await this.questionRepository.save(question);

    if (!lessonId) {
      throw new NotFoundException(
        `No lesson found containing with id "${id}".`,
      );
    }

    const remainingQuestions =
      await this.questionRepository.findActiveQuestionsByLessonId(lessonId);

    for (let index = 0; index < remainingQuestions.length; index++) {
      remainingQuestions[index].position = index + 1;
      await this.questionRepository.save(remainingQuestions[index]);
    }
  }
}
