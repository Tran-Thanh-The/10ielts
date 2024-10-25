import { CategoryEntity } from "@/domain/categories/infrastructure/persistence/relational/entities/category.entity";
import { CourseResponseDto } from "@/domain/courses/dto/course-response-dto";
import { CreateCourseDto } from "@/domain/courses/dto/create-course.dto";
import { FileMapper } from "@/files/infrastructure/persistence/relational/mappers/file.mapper";
import { Course } from "../../../../domain/course";
import { CourseEntity } from "../entities/course.entity";
import { FileEntity } from '@/files/infrastructure/persistence/relational/entities/file.entity';

export class CourseMapper {
  static toDomain(raw: CourseEntity): Course {
    const domainEntity = new Course();
    domainEntity.id = raw.id;
    domainEntity.name = raw.name;
    domainEntity.price = raw.price;
    domainEntity.description = raw.description;
    if (raw.photo) {
      domainEntity.photo = FileMapper.toDomain(raw.photo);
    }
    domainEntity.category = raw.category;
    domainEntity.status = raw.status;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    domainEntity.deletedAt = raw.deletedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Course): CourseEntity {
    const persistenceEntity = new CourseEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.name = domainEntity.name;
    persistenceEntity.price = domainEntity.price;
    persistenceEntity.description = domainEntity.description;

    const photo: FileEntity | undefined | null = undefined;

    if (domainEntity.photo) {
      persistenceEntity.photo = FileMapper.toPersistence(domainEntity.photo);
    } else {
      persistenceEntity.photo = null;
    }

    persistenceEntity.status = domainEntity.status;
    persistenceEntity.category = domainEntity.category;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;
    persistenceEntity.deletedAt = domainEntity.deletedAt;

    return persistenceEntity;
  }

  static toModel(dto: CreateCourseDto): Course {
    const model = new Course();
    model.name = dto.name;
    model.price = dto.price;
    model.description = dto.description;
    const category = new CategoryEntity();
    category.id = dto.category_id;
    model.category = category;
    return model;
  }

  static toDto(model: Course): CourseResponseDto {
    const dto = new CourseResponseDto();
    dto.id = model.id;
    dto.name = model.name;
    dto.price = model.price;
    dto.status = model.status;
    dto.description = model.description;
    dto.category_id = model.category.id;

    if (model.photo) {
      dto.photo = model.photo;
    }

    dto.createAt = model.createdAt;
    dto.updateAt = model.updatedAt;
    return dto;
  }
}
