import { StatusEnum } from "@/common/enums/status.enum";
import { IPaginationOptions } from "@/utils/types/pagination-options";
import { Injectable, NotFoundException } from "@nestjs/common";
import { UserCourse } from "./domain/user-course";
import { CreateUserCourseDto } from "./dto/create-user-course.dto";
import { UpdateCurrentLessonDto } from "./dto/update-current-lesson.dto";
import { UpdateUserCourseDto } from "./dto/update-user-course.dto";
import { UserCourseMapper } from "./infrastructure/persistence/relational/mappers/user-course.mapper";
import { UserCourseRepository } from "./infrastructure/persistence/user-course.repository";

@Injectable()
export class UserCoursesService {
  constructor(private readonly userCourseRepository: UserCourseRepository) {}

  async create(createUserCourseDto: CreateUserCourseDto, userId: string) {
    createUserCourseDto.user_id = userId;
    const model = UserCourseMapper.toModel(createUserCourseDto);
    model.status = StatusEnum.ACTIVE;
    const savedUserCourse = await this.userCourseRepository.create(model);
    return UserCourseMapper.toDto(savedUserCourse);
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.userCourseRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  async updateCurrentLesson(
    updateCurrentLessonDto: UpdateCurrentLessonDto,
    userId: string,
  ) {
    const userCourse =
      await this.userCourseRepository.findUserCourseByUserId(userId);

    if (!userCourse) {
      throw new NotFoundException("User course not found");
    }

    userCourse.currentLesson = updateCurrentLessonDto.currentLesson;
    userCourse.lastPosition = updateCurrentLessonDto.lastPosition;
    await this.userCourseRepository.save(userCourse);
    return UserCourseMapper.toDto(userCourse);
  }

  findOne(id: UserCourse["id"]) {
    return this.userCourseRepository.findById(id);
  }

  update(id: UserCourse["id"], updateUserCourseDto: UpdateUserCourseDto) {
    return this.userCourseRepository.update(id, updateUserCourseDto);
  }

  remove(id: UserCourse["id"]) {
    return this.userCourseRepository.remove(id);
  }
}
