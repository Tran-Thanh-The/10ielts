import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateLessonDto } from "./dto/create-lesson.dto";
import { UpdateLessonDto } from "./dto/update-lesson.dto";
import { LessonRepository } from "./infrastructure/persistence/lesson.repository";
import { IPaginationOptions } from "@/utils/types/pagination-options";
import { Lesson } from "./domain/lesson";
import { LessonCourseRepository } from "../lesson-courses/infrastructure/persistence/lesson-course.repository";
import { LessonCourseMapper } from "../lesson-courses/infrastructure/persistence/relational/mappers/lesson-course.mapper";
import { LessonMapper } from "./infrastructure/persistence/relational/mappers/lesson.mapper";
import { StatusEnum } from "@/common/enums/status.enum";
import { CourseRepository } from "../courses/infrastructure/persistence/course.repository";
import { FilesLocalService } from "@/files/infrastructure/uploader/local/files.service";
import { UserLessonMapper } from "../user-lessons/infrastructure/persistence/relational/mappers/user-lesson.mapper";
import { UserLessonRepository } from "../user-lessons/infrastructure/persistence/user-lesson.repository";
import { NullableType } from "@/utils/types/nullable.type";

@Injectable()
export class LessonsService {
  constructor(
    private readonly lessonRepository: LessonRepository,
    private readonly lessonCourseRepository: LessonCourseRepository,
    private readonly userLessonRepository: UserLessonRepository,
    private readonly courseRepository: CourseRepository,
    private readonly filesLocalService: FilesLocalService,
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
      const uploadedFile = await this.filesLocalService.create(fileLesson);
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

      //Thêm vào bảng user_lesson: xác định ai là người thêm lesson
      const userLesson = UserLessonMapper.toModel({
        user_id: Number(userId),
        lesson_id: savedLesson.id,
        status: StatusEnum.ACTIVE,
      });
      await this.userLessonRepository.create(userLesson);
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

  async getLessonDetail(id: Lesson["id"]): Promise<NullableType<Lesson>> {
    return this.lessonRepository.getLessonDetail(id);
  }

  async findById(id: Lesson["id"]): Promise<NullableType<Lesson>> {
    return this.lessonRepository.findById(id);
  }

  async update(id: Lesson["id"], updateLessonDto: UpdateLessonDto) {
    const existingLesson = await this.lessonRepository.findById(id);
    if (!existingLesson) {
      throw new NotFoundException(`Lesson with id "${id}" not found.`);
    }

    return this.lessonRepository.update(id, updateLessonDto);
  }

  async remove(id: Lesson["id"]) {
    const lessonCourse = await this.lessonCourseRepository.findByLessonId(id);
    if (!lessonCourse) {
      throw new NotFoundException(
        `No lesson course found for lesson with id "${id}".`,
      );
    }

    lessonCourse.status = StatusEnum.IN_ACTIVE;
    const lesson = await this.lessonRepository.findById(id);
    if (!lesson) {
      throw new NotFoundException(
        `No lesson found for lesson with id "${id}".`,
      );
    }
    lesson.status = StatusEnum.IN_ACTIVE;
    await this.lessonRepository.save(lesson);
    await this.lessonCourseRepository.save(lessonCourse);

    const remainingLessons =
      await this.lessonCourseRepository.findActiveLessonsByCourseId(
        lessonCourse.course.id,
      );

    for (let index = 0; index < remainingLessons.length; index++) {
      remainingLessons[index].position = index + 1;
      await this.lessonCourseRepository.save(remainingLessons[index]);
    }
  }
}
