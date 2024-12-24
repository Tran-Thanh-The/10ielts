import { DeepPartial } from "@/utils/types/deep-partial.type";
import { NullableType } from "@/utils/types/nullable.type";
import { IPaginationOptions } from "@/utils/types/pagination-options";
import { Course } from "../../domain/course";
import { CourseWithDetailsDTO } from "../../dto/course-details-dto";
import { StatusEnum } from "@/common/enums/status.enum";

export abstract class CourseRepository {
  abstract create(
    data: Omit<Course, "id" | "createdAt" | "updatedAt" | "deletedAt">,
  ): Promise<Course>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Course[]>;

  abstract findById(id: Course["id"]): Promise<NullableType<Course>>;
  abstract findByName(name: Course["name"]): Promise<NullableType<Course>>;
  abstract update(
    id: Course["id"],
    payload: DeepPartial<Course>,
  ): Promise<Course | null>;

  abstract remove(id: Course["id"]): Promise<void>;
  abstract save(course: Course): Promise<void>;
  abstract findOne(id: string, relations?: string[]): Promise<Course | null>;
  abstract checkIsMyCourse(userId: string, courseId: string): Promise<boolean>;

  abstract getCourseDetailById(
    id: string,
    userId: string,
  ): Promise<CourseWithDetailsDTO | null>;

  abstract getListCourse(params: {
    status?: StatusEnum;
    userId?: string;
    invoiceId?: string;
    categoryId?: string;
    paginationOptions?: IPaginationOptions;
    isMyCourse?: boolean;
    search?: string;
    orderBy?: { [key: string]: "ASC" | "DESC" };
  }): Promise<{
    data: CourseWithDetailsDTO[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
}
