import { StatusEnum } from "@/common/enums/status.enum";
import { FilesGoogleDriveService } from "@/files/infrastructure/uploader/google-driver/files.service";
import { IPaginationOptions } from "@/utils/types/pagination-options";
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { LessonCourseRepository } from "../lesson-courses/infrastructure/persistence/lesson-course.repository";
import { UserCourseRepository } from "../user-courses/infrastructure/persistence/user-course.repository";
import { UserRepository } from "../users/infrastructure/persistence/user.repository";
import { Course } from "./domain/course";
import { CourseWithDetailsDTO } from "./dto/course-details-dto";
import { CourseListResponseDto } from "./dto/courses-response-dto";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";
import { CourseRepository } from "./infrastructure/persistence/course.repository";
import { CourseMapper } from "./infrastructure/persistence/relational/mappers/course.mapper";

@Injectable()
export class CoursesService {
  constructor(
    private readonly courseRepository: CourseRepository,
    private readonly lessonCourseRepository: LessonCourseRepository,
    private readonly userCourseRepository: UserCourseRepository,
    private readonly userRepository: UserRepository,
    private readonly filesGoogleDrivelService: FilesGoogleDriveService,
  ) {}

  async create(
    createCourseDto: CreateCourseDto,
    userId: string,
    photoFile: Express.Multer.File,
  ) {
    const existingCourse = await this.courseRepository.findByName(
      createCourseDto.name,
    );
    if (existingCourse) {
      throw new ConflictException(
        `Course with name "${createCourseDto.name}" already exists.`,
      );
    }
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const model = CourseMapper.toModel(createCourseDto);

    if (photoFile) {
      const uploadedFile =
        await this.filesGoogleDrivelService.create(photoFile);
      model.photo = uploadedFile.file;
    }
    const course = await this.courseRepository.create(model);

    return CourseMapper.toDto(course);
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.courseRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  async getCourseDetails(
    id: string,
    userId: string,
  ): Promise<CourseWithDetailsDTO> {
    const courseExists = await this.findOne(id);
    if (!courseExists) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    const courseDetails = await this.courseRepository.getCourseDetailById(
      id,
      userId,
    );
    if (!courseDetails) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return courseDetails;
  }

  async getListCourse(
    status?: StatusEnum,
    userId?: string,
    invoiceId?: string,
    categoryId?: string,
    page: number = 1,
    limit: number = 10,
    search?: string,
    isMyCourse?: string,
    orderBy: { [key: string]: "ASC" | "DESC" } = { created_at: "DESC" },
  ): Promise<CourseListResponseDto<CourseWithDetailsDTO>> {
    const params = {
      status,
      userId: userId,
      invoiceId,
      categoryId,
      paginationOptions: {
        page,
        limit,
      },
      isMyCourse: isMyCourse?.toLowerCase() === "true",
      search,
      orderBy,
    };
    const result = await this.courseRepository.getListCourse(params);

    return result;
  }

  async findOne(id: Course["id"]) {
    const course = await this.courseRepository.findById(id);
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return course;
  }

  async update(
    id: Course["id"],
    updateCourseDto: UpdateCourseDto,
    photoFile?: Express.Multer.File,
  ) {
    const existingCourse = await this.courseRepository.findById(id);
    if (!existingCourse) {
      throw new NotFoundException(`Course with id "${id}" not found.`);
    }

    if (photoFile) {
      if (existingCourse.photo) {
        // Tách rời file khỏi course trước khi xóa
        await this.courseRepository.update(id, { photo: null });
        await this.filesGoogleDrivelService.delete(existingCourse.photo);
      }

      const uploadedFile =
        await this.filesGoogleDrivelService.create(photoFile);
      updateCourseDto.photo = uploadedFile.file;
    }

    return this.courseRepository.update(id, updateCourseDto);
  }

  async remove(id: Course["id"]) {
    const course = await this.courseRepository.findById(id);
    if (!course) {
      throw new NotFoundException("Course not found");
    }

    if (course.photo) {
      try {
        await this.filesGoogleDrivelService.delete(course.photo);
      } catch (error) {
        console.error(
          `Failed to delete file on Google Drive: ${error.message}`,
        );
        throw new ConflictException("Could not delete associated file");
      }
    }

    const userCourses = await this.userCourseRepository.findByCourseId(id);
    if (userCourses) {
      await Promise.all(
        userCourses.map((userCourse) =>
          this.userCourseRepository.remove(userCourse.id),
        ),
      );
    }

    const lessonCourses = await this.lessonCourseRepository.findByCourseId(id);
    if (lessonCourses) {
      await Promise.all(
        lessonCourses.map((lessonCourse) =>
          this.lessonCourseRepository.remove(lessonCourse.id),
        ),
      );
    }

    await this.courseRepository.save(course);
    return this.courseRepository.remove(id);
  }
}
