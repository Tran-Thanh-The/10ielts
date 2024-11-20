import { Injectable } from "@nestjs/common";
import { CreateUserAnswerDto } from "./dto/create-user-answer.dto";
import { UpdateUserAnswerDto } from "./dto/update-user-answer.dto";
import { UserAnswerRepository } from "./infrastructure/persistence/user-answer.repository";
import { IPaginationOptions } from "@/utils/types/pagination-options";
import { UserAnswer } from "./domain/user-answer";
import { UserAnswerMapper } from "./infrastructure/persistence/relational/mappers/user-answer.mapper";

@Injectable()
export class UserAnswersService {
  constructor(private readonly userAnswerRepository: UserAnswerRepository) {}

  create(createUserAnswerDto: CreateUserAnswerDto) {
    const model = UserAnswerMapper.toModel(createUserAnswerDto);
    return this.userAnswerRepository.create(model);
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.userAnswerRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findOne(id: UserAnswer["id"]) {
    return this.userAnswerRepository.findById(id);
  }

  update(id: UserAnswer["id"], updateUserAnswerDto: UpdateUserAnswerDto) {
    return this.userAnswerRepository.update(id, updateUserAnswerDto);
  }

  remove(id: UserAnswer["id"]) {
    return this.userAnswerRepository.remove(id);
  }
}
