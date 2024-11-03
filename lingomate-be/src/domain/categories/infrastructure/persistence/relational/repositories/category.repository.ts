import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CategoryEntity } from "../entities/category.entity";
import { NullableType } from "@/utils/types/nullable.type";
import { CategoryRepository } from "../../category.repository";
import { CategoryMapper } from "../mappers/category.mapper";
import { IPaginationOptions } from "@/utils/types/pagination-options";
import { Category } from "@/domain/categories/domain/category";

@Injectable()
export class CategoryRelationalRepository implements CategoryRepository {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}
  async findByCourseId(courseId: string): Promise<Category | null> {
    return await this.categoryRepository
      .createQueryBuilder("category")
      .leftJoin("category.course", "course")
      .where("course.id = :courseId", { courseId })
      .getOne();
  }

  async create(data: Category): Promise<Category> {
    const persistenceModel = CategoryMapper.toPersistence(data);
    const newEntity = await this.categoryRepository.save(
      this.categoryRepository.create(persistenceModel),
    );
    return CategoryMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Category[]> {
    const entities = await this.categoryRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => CategoryMapper.toDomain(entity));
  }

  async findById(id: Category["id"]): Promise<NullableType<Category>> {
    const entity = await this.categoryRepository.findOne({
      where: { id },
    });

    return entity ? CategoryMapper.toDomain(entity) : null;
  }

  async findByName(name: Category["name"]): Promise<NullableType<Category>> {
    const entity = await this.categoryRepository.findOne({
      where: { name },
    });

    return entity ? CategoryMapper.toDomain(entity) : null;
  }

  async update(
    id: Category["id"],
    payload: Partial<Category>,
  ): Promise<Category> {
    const entity = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error("Record not found");
    }

    const updatedEntity = await this.categoryRepository.save(
      this.categoryRepository.create(
        CategoryMapper.toPersistence({
          ...CategoryMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return CategoryMapper.toDomain(updatedEntity);
  }

  async remove(id: Category["id"]): Promise<void> {
    await this.categoryRepository.delete(id);
  }
}
