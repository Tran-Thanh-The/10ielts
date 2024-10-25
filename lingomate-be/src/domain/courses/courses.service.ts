import { StatusEnum } from "@/common/enums/status.enum";
import { CourseEntity } from "@/domain/courses/infrastructure/persistence/relational/entities/course.entity";
import { UserCourse } from "@/domain/user-courses/domain/user-course";
import { FilesLocalService } from "@/files/infrastructure/uploader/local/files.service";
import { IPaginationOptions } from "@/utils/types/pagination-options";
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { LessonCourseRepository } from "../lesson-courses/infrastructure/persistence/lesson-course.repository";
import { UserCourseRepository } from "../user-courses/infrastructure/persistence/user-course.repository";
import { UserEntity } from "../users/infrastructure/persistence/relational/entities/user.entity";
import { UserRepository } from "../users/infrastructure/persistence/user.repository";
import { Course } from "./domain/course";
import { CourseWithDetailsDTO } from "./dto/course-details-dto";
import { CourseResponseDto } from "./dto/course-response-dto";
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
    private readonly filesLocalService: FilesLocalService,
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

    const model = await CourseMapper.toModel(createCourseDto);
    model.status = StatusEnum.ACTIVE;
    const course = await this.courseRepository.create(model);

    const userCourse = new UserCourse();
    userCourse.user = user as UserEntity;
    userCourse.course = course as CourseEntity;
    userCourse.status = StatusEnum.ACTIVE;
    await this.userCourseRepository.create(userCourse);

    console.log(`PHOTO_FILE: ${photoFile ? photoFile : "undefined"}`);
    if (photoFile) {
      const uploadedFile = await this.filesLocalService.create(photoFile);
      course.photo = uploadedFile.file;
      await this.courseRepository.update(course.id, course);
    }
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
    console.log(`courseExists: ${courseExists.id}`);
    console.log(`courseDetails: ${courseDetails}`);
    if (!courseDetails) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    courseDetails.isMyCourse = true;
    return courseDetails;
  }

  async getListCourse(
    status?: StatusEnum,
    userId?: string,
    invoiceId?: string,
    page: number = 1,
    limit: number = 10,
    orderBy: { [key: string]: "ASC" | "DESC" } = { created_at: "DESC" },
  ): Promise<CourseListResponseDto<CourseResponseDto>> {
    const result = await this.courseRepository.getListCourse({
      status,
      userId,
      invoiceId,
      paginationOptions: {
        page,
        limit,
      },
      orderBy,
    });

    return {
      ...result,
      data: result.data.map((course) => CourseMapper.toDto(course)),
    };
  }

  async findOne(id: Course["id"]) {
    const course = await this.courseRepository.findById(id);
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return course;
  }

  update(id: Course["id"], updateCourseDto: UpdateCourseDto) {
    return this.courseRepository.update(id, updateCourseDto);
  }

  async remove(id: Course["id"]) {
    const course = await this.courseRepository.findById(id);
    if (!course) {
      throw new NotFoundException("Course not found");
    }

    course.status = StatusEnum.IN_ACTIVE;

    const userCourses = await this.userCourseRepository.findByCourseId(id);
    if (userCourses) {
      await Promise.all(
        userCourses.map((userCourse) =>
          this.userCourseRepository.update(userCourse.id, {
            status: StatusEnum.IN_ACTIVE,
          }),
        ),
      );
    }

    const lessonCourses = await this.lessonCourseRepository.findByCourseId(id);
    if (lessonCourses) {
      await Promise.all(
        lessonCourses.map((lessonCourse) =>
          this.lessonCourseRepository.update(lessonCourse.id, {
            status: StatusEnum.IN_ACTIVE,
          }),
        ),
      );
    }

    await this.courseRepository.save(course);
  }
}
