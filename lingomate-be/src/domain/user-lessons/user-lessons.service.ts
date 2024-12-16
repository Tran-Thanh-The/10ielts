import { Injectable } from "@nestjs/common";
import { CreateUserLessonDto } from "./dto/create-user-lesson.dto";
import { UpdateUserLessonDto } from "./dto/update-user-lesson.dto";
import { UserLessonRepository } from "./infrastructure/persistence/user-lesson.repository";
import { IPaginationOptions } from "@/utils/types/pagination-options";
import { UserLesson } from "./domain/user-lesson";
import { UserLessonMapper } from "./infrastructure/persistence/relational/mappers/user-lesson.mapper";

@Injectable()
export class UserLessonsService {
  constructor(private readonly userLessonRepository: UserLessonRepository) {}

  create(createUserLessonDto: CreateUserLessonDto) {
    const model = UserLessonMapper.toModel(createUserLessonDto);
    return this.userLessonRepository.create(model);
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.userLessonRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findAllByUserId(userId: string){
    return this.userLessonRepository.findAllByUserId(userId);
  }
  

  findOne(id: UserLesson["id"]) {
    return this.userLessonRepository.findById(id);
  }

  update(id: UserLesson["id"], updateUserLessonDto: UpdateUserLessonDto) {
    return this.userLessonRepository.update(id, updateUserLessonDto);
  }

  remove(id: UserLesson["id"]) {
    return this.userLessonRepository.remove(id);
  }
}
