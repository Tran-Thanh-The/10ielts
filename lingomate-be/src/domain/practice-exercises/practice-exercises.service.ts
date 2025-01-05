import { IPaginationOptions } from "@/utils/types/pagination-options";
import { Injectable, NotFoundException } from "@nestjs/common";
import { PracticeExercise } from "./domain/practice-exercise";
import { CreatePracticeExerciseDto } from "./dto/create-practice-exercise.dto";
import { UpdatePracticeExerciseDto } from "./dto/update-practice-exercise.dto";
import { PracticeExerciseRepository } from "./infrastructure/persistence/practice-exercise.repository";
import { PracticeExerciseMapper } from "./infrastructure/persistence/relational/mappers/practice-exercise.mapper";

@Injectable()
export class PracticeExercisesService {
  constructor(
    private readonly practiceExerciseRepository: PracticeExerciseRepository,
  ) {}

  async create(
    userId: string,
    createPracticeExerciseDto: CreatePracticeExerciseDto,
  ) {
    createPracticeExerciseDto.user_id = Number(userId);
    if (!createPracticeExerciseDto.price) {
      createPracticeExerciseDto.price = 0;
    }
    const model = PracticeExerciseMapper.toModel(createPracticeExerciseDto);
    model.createdBy = Number(userId);
    const savedPracticeExercise =
      await this.practiceExerciseRepository.create(model);
    return savedPracticeExercise;
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return await this.practiceExerciseRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findOne(id: PracticeExercise["id"]) {
    return this.practiceExerciseRepository.findById(id);
  }

  async update(
    userId: string,
    id: PracticeExercise["id"],
    updatePracticeExerciseDto: UpdatePracticeExerciseDto,
  ) {
    const existingPractice = await this.practiceExerciseRepository.findById(id);
    if (!existingPractice) {
      throw new NotFoundException(`Practice with id "${id}" not found.`);
    }
    const updatedData = {
      ...updatePracticeExerciseDto,
      updatedBy: Number(userId),
    };
    return this.practiceExerciseRepository.update(id, updatedData);
  }

  async remove(id: PracticeExercise["id"]) {
    return this.practiceExerciseRepository.remove(id);
  }
}
