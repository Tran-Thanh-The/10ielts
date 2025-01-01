import { StatusEnum } from "@/common/enums/status.enum";
import { FilesLocalService } from "@/files/infrastructure/uploader/local/files.service";
import { NullableType } from "@/utils/types/nullable.type";
import { IPaginationOptions } from "@/utils/types/pagination-options";
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CourseRepository } from "../courses/infrastructure/persistence/course.repository";
import { LessonCourseRepository } from "../lesson-courses/infrastructure/persistence/lesson-course.repository";
import { LessonCourseMapper } from "../lesson-courses/infrastructure/persistence/relational/mappers/lesson-course.mapper";
import { Lesson } from "./domain/lesson";
import { CreateLessonDto } from "./dto/create-lesson.dto";
import { UpdateLessonDto } from "./dto/update-lesson.dto";
import { LessonRepository } from "./infrastructure/persistence/lesson.repository";
import { LessonMapper } from "./infrastructure/persistence/relational/mappers/lesson.mapper";
import { FilesGoogleDriveService } from "@/files/infrastructure/uploader/google-driver/files.service";

@Injectable()
export class LessonsService {
  constructor(
    private readonly lessonRepository: LessonRepository,
    private readonly lessonCourseRepository: LessonCourseRepository,
    private readonly courseRepository: CourseRepository,
    private readonly filesGoogleDrivelService: FilesGoogleDriveService,
  ) {}

  async create(
    userId: string,
    courseId: string,
    createLessonDto: CreateLessonDto,
    fileLesson: Express.Multer.File,
  ) {
    const course = await this.courseRepository.findOne(courseId);
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }
    const existingLesson = await this.lessonRepository.findByTitle(
      createLessonDto.title,
    );
    if (existingLesson) {
      throw new ConflictException(
        `Lesson with title "${createLessonDto.title}" already exists.`,
      );
    }

    const model = LessonMapper.toModel(createLessonDto);
    model.status = StatusEnum.ACTIVE;
    if (fileLesson) {
      const uploadedFile = await this.filesGoogleDrivelService.create(fileLesson);
      model.file = uploadedFile.file;
    }
    const savedLesson = await this.lessonRepository.create(model);
    if (courseId) {
      const ACTIVECount =
        await this.lessonCourseRepository.countActiveLessonsByCourseId(
          courseId,
        );
      const newPosition = ACTIVECount + 1;

      const lessonCourse = LessonCourseMapper.toModel({
        course_id: courseId,
        lesson_id: savedLesson.id,
        position: newPosition,
        status: StatusEnum.ACTIVE,
      });
      await this.lessonCourseRepository.create(lessonCourse);
    }

    return savedLesson;
  }

  async findAll(): Promise<Lesson[]> {
    return this.lessonRepository.findAll();
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Lesson[]> {
    const entities = await this.lessonRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
    return entities;
  }

  async findAllWithPaginationAndCourseId({
    courseId,
    paginationOptions,
  }: {
    courseId: string;
    paginationOptions: IPaginationOptions;
  }): Promise<Lesson[]> {
    return this.lessonRepository.findAllWithPaginationAndCourseId({
      courseId,
      paginationOptions,
    });
  }

  async getLessonDetail(
    id: Lesson["id"],
    paginationOptions: IPaginationOptions & {
      order: "ASC" | "DESC";
      status?: StatusEnum;
    },
  ): Promise<NullableType<Lesson>> {
    return this.lessonRepository.getLessonDetail(id, paginationOptions);
  }

  async findById(id: Lesson["id"]): Promise<NullableType<Lesson>> {
    return this.lessonRepository.findById(id);
  }

  async update(
    id: Lesson["id"],
    updateLessonDto: UpdateLessonDto,
    fileLesson?: Express.Multer.File,
  ) {
    const existingLesson = await this.lessonRepository.findById(id);
    if (!existingLesson) {
      throw new NotFoundException(`Lesson with id "${id}" not found.`);
    }

    if (fileLesson) {
      if (existingLesson.file) {
        // Tách rời file khỏi Lesson trước khi xóa
        await this.lessonRepository.update(id, { file: null });
        await this.filesGoogleDrivelService.delete(existingLesson.file);
      }

      const uploadedFile = await this.filesGoogleDrivelService.create(fileLesson);
      updateLessonDto.file = uploadedFile.file;
    }

    return this.lessonRepository.update(id, updateLessonDto);
  }

  async remove(id: Lesson["id"]) {
    const lesson = await this.lessonRepository.findById(id);
    if (!lesson) {
      throw new NotFoundException("Lesson not found");
    }

    const lessonCourse = await this.lessonCourseRepository.findByLessonId(id);
    if (!lessonCourse) {
      throw new NotFoundException(
        `No lesson course found for lesson with id "${id}".`,
      );
    }
    await this.lessonCourseRepository.remove(lessonCourse.id);

    await this.lessonRepository.remove(id);

    if (lesson.file) {
      try {
        await this.filesGoogleDrivelService.delete(lesson.file);
      } catch (error) {
        console.error(`Failed to delete file on Google Drive: ${error.message}`);
        console.warn("File deletion failed but lesson was removed successfully");
      }
    }

    return true;
  }
}
