import { StatusEnum } from "@/common/enums/status.enum";
import { CourseWithDetailsDTO } from "@/domain/courses/dto/course-details-dto";
import { CourseEntity } from "@/domain/courses/infrastructure/persistence/relational/entities/course.entity";
import { LessonMapper } from "@/domain/lessons/infrastructure/persistence/relational/mappers/lesson.mapper";
import { UserCourseEntity } from "@/domain/user-courses/infrastructure/persistence/relational/entities/user-course.entity";
import { UserLessonEntity } from "@/domain/user-lessons/infrastructure/persistence/relational/entities/user-lesson.entity";
import { UserEntity } from "@/domain/users/infrastructure/persistence/relational/entities/user.entity";
import { NullableType } from "@/utils/types/nullable.type";
import { IPaginationOptions } from "@/utils/types/pagination-options";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { isUUID } from "class-validator";
import { Repository } from "typeorm";
import { Course } from "../../../../domain/course";
import { CourseRepository } from "../../course.repository";
import { CourseMapper } from "../mappers/course.mapper";

@Injectable()
export class CourseRelationalRepository implements CourseRepository {
  constructor(
    @InjectRepository(CourseEntity)
    private readonly courseRepository: Repository<CourseEntity>,
    @InjectRepository(UserCourseEntity)
    private readonly userCourseRepository: Repository<UserCourseEntity>,
    @InjectRepository(UserLessonEntity)
    private readonly userLessonRepository: Repository<UserLessonEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(data: Course): Promise<Course> {
    const persistenceModel = CourseMapper.toPersistence(data);
    const newEntity = await this.courseRepository.save(
      this.courseRepository.create(persistenceModel),
    );
    return CourseMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Course[]> {
    const entities = await this.courseRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => CourseMapper.toDomain(entity));
  }

  async findById(id: Course["id"]): Promise<NullableType<Course>> {
    const entity = await this.courseRepository.findOne({
      where: { id },
    });

    return entity ? CourseMapper.toDomain(entity) : null;
  }

  async findByName(name: Course["name"]): Promise<NullableType<Course>> {
    const entity = await this.courseRepository.findOne({
      where: { name },
    });

    return entity ? CourseMapper.toDomain(entity) : null;
  }

  async update(id: Course["id"], payload: Partial<Course>): Promise<Course> {
    const entity = await this.courseRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error("Record not found");
    }

    const updatedEntity = await this.courseRepository.save(
      this.courseRepository.create(
        CourseMapper.toPersistence({
          ...CourseMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return CourseMapper.toDomain(updatedEntity);
  }

  async remove(id: Course["id"]): Promise<void> {
    await this.courseRepository.delete(id);
  }

  async save(course: Course): Promise<void> {
    if (!course || !course.id) {
      throw new NotFoundException("Course not found");
    }
    await this.courseRepository.save(course);
  }

  async findOne(id: string, relations: string[] = []): Promise<Course | null> {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations,
    });

    return course ? CourseMapper.toDomain(course) : null;
  }

  // async checkIsMyCourse(userId: string, courseId: string): Promise<boolean> {
  //   const userIdNumber = Number(userId);

  //   const checkOwnCourse = await this.userCourseRepository
  //     .createQueryBuilder("uc")
  //     .select("uc")
  //     .innerJoin("uc.course", "c")
  //     .innerJoin("c.invoiceProducts", "ip")
  //     .innerJoin("ip.invoice", "i")
  //     .where("i.userId = :userId", { userId: userIdNumber })
  //     .andWhere("uc.courseId = :courseId", { courseId })
  //     .getOne();

  //   return !!checkOwnCourse;
  // }
  async checkIsMyCourse(userId: string, courseId: string): Promise<boolean> {
    const userIdNumber = Number(userId);

    const checkUserCourse = await this.userCourseRepository
      .createQueryBuilder("uc")
      .where("uc.userId = :userId", { userId: userIdNumber })
      .andWhere("uc.courseId = :courseId", { courseId })
      .getOne();

    return !!checkUserCourse;
  }

  async getCourseDetailById(
    id: string,
    userId: string,
  ): Promise<CourseWithDetailsDTO | null> {
    const courseEntity = await this.courseRepository
      .createQueryBuilder("course")
      .leftJoinAndSelect("course.category", "category")
      .leftJoinAndSelect("course.photo", "photo")
      .leftJoinAndSelect("course.lessonCourses", "lessonCourse")
      .leftJoinAndSelect("lessonCourse.lesson", "lesson")
      .leftJoinAndSelect(
        "lesson.userLessons",
        "userLesson",
        "userLesson.userId = :userId",
        { userId: Number(userId) },
      )
      .where("course.id = :id", { id })
      .getOne();

    if (!courseEntity) {
      return null;
    }

    const completedLessons = courseEntity.lessonCourses.filter(
      (lc) => lc.lesson.userLessons?.[0]?.isCompleted,
    ).length;

    const courseDetail: Omit<CourseWithDetailsDTO, "isMyCourse"> = {
      id: courseEntity.id,
      title: courseEntity.name,
      price: courseEntity.price,
      description: courseEntity.description,
      photo: courseEntity.photo,
      category: courseEntity.category,
      createdAt: courseEntity.createdAt,
      status: courseEntity.status,
      totalLesson: courseEntity.lessonCourses.length,
      completedLesson: completedLessons,
      lessons: courseEntity.lessonCourses.map((lc) => ({
        ...LessonMapper.toDto(lc.lesson),
        isCompleted: lc.lesson.userLessons?.[0]?.isCompleted || false,
      })),
    };

    const isMyCourse = userId ? await this.checkIsMyCourse(userId, id) : false;
    const result = {
      ...courseDetail,
      isMyCourse,
    };
    return result;
  }

  // async getListCourse(params: {
  //   status?: StatusEnum;
  //   userId?: string;
  //   invoiceId?: string;
  //   categoryId?: string;
  //   paginationOptions?: IPaginationOptions;
  //   isMyCourse?: boolean;
  //   search?: string;
  //   orderBy?: { [key: string]: "ASC" | "DESC" };
  // }): Promise<{
  //   data: CourseWithDetailsDTO[];
  //   total: number;
  //   page: number;
  //   limit: number;
  //   totalPages: number;
  // }> {
  //   const {
  //     status,
  //     userId,
  //     invoiceId,
  //     categoryId,
  //     paginationOptions,
  //     orderBy,
  //     isMyCourse,
  //     search,
  //   } = params;

  //   const queryBuilder = this.courseRepository
  //     .createQueryBuilder("course")
  //     .leftJoinAndSelect("course.photo", "photo")
  //     .leftJoinAndSelect("course.category", "category")
  //     .leftJoin("course.userCourses", "userCourse")
  //     .leftJoin("course.invoiceProducts", "invoiceProducts")
  //     .leftJoin("invoice", "invoice", "invoice.id = invoiceProducts.invoiceId");

  //   // Filter by userId
  //   if (userId) {
  //     console.log("UserID tồng tài");

  //     queryBuilder.andWhere(
  //       "(userCourse.userId = :userId OR invoice.userId = :userId)",
  //       { userId: Number(userId) },
  //     );
  //   }

  //   // Filter by invoiceId
  //   if (invoiceId && isUUID(invoiceId)) {
  //     queryBuilder.andWhere("invoice.id = :invoiceId", { invoiceId });
  //   }

  //   // Filter by categoryId
  //   if (categoryId && isUUID(categoryId)) {
  //     queryBuilder.andWhere("category.id = :categoryId", { categoryId });
  //   }

  //   // Filter by course status
  //   if (status) {
  //     queryBuilder.andWhere("course.status = :status", { status });
  //   }

  //   // Filter by search query
  //   if (search) {
  //     queryBuilder.andWhere(
  //       "(course.name LIKE :search OR course.description LIKE :search)",
  //       { search: `%${search}%` },
  //     );
  //   }

  //   // Filter by isMyCourse
  //   if (isMyCourse !== undefined && userId) {
  //     if (isMyCourse) {
  //       queryBuilder.andWhere("userCourse.userId = :userId", {
  //         userId: Number(userId),
  //       });
  //     } else {
  //       queryBuilder.andWhere(
  //         "(userCourse.userId IS NULL OR userCourse.userId != :userId)",
  //         { userId: Number(userId) },
  //       );
  //     }
  //   }

  //   // Order by specified columns
  //   const validColumns = [
  //     "id",
  //     "name",
  //     "price",
  //     "description",
  //     "status",
  //     "createdAt",
  //     "updatedAt",
  //     "photo",
  //   ];

  //   if (orderBy && Object.keys(orderBy).length > 0) {
  //     Object.entries(orderBy).forEach(([key, value]) => {
  //       if (validColumns.includes(key)) {
  //         queryBuilder.addOrderBy(`course.${key}`, value);
  //       }
  //     });
  //   } else {
  //     queryBuilder.orderBy("course.createdAt", "DESC");
  //   }

  //   queryBuilder.addOrderBy("course.id", "ASC");

  //   // Pagination
  //   const total = await queryBuilder.getCount();

  //   if (paginationOptions) {
  //     const { page, limit } = paginationOptions;
  //     queryBuilder.skip((page - 1) * limit).take(limit);
  //   }

  //   const courses = await queryBuilder.getMany();

  //   const mappedCourses = await Promise.all(
  //     courses.map(async (course) => {
  //       const courseEntity = await this.courseRepository
  //         .createQueryBuilder("course")
  //         .leftJoinAndSelect("course.category", "category")
  //         .leftJoinAndSelect("course.photo", "photo")
  //         .leftJoinAndSelect("course.lessonCourses", "lessonCourse")
  //         .leftJoinAndSelect("lessonCourse.lesson", "lesson")
  //         .leftJoinAndSelect(
  //           "lesson.userLessons",
  //           "userLesson",
  //           "userLesson.userId = :userId",
  //           { userId: userId ? Number(userId) : null },
  //         )
  //         .where("course.id = :id", { id: course.id })
  //         .getOne();

  //       if (!courseEntity) return null;

  //       const completedLessons = courseEntity.lessonCourses.filter(
  //         (lc) => lc.lesson.userLessons?.[0]?.isCompleted,
  //       ).length;

  //       const courseDetail: CourseWithDetailsDTO = {
  //         id: courseEntity.id,
  //         title: courseEntity.name,
  //         price: courseEntity.price,
  //         description: courseEntity.description,
  //         photo: courseEntity.photo,
  //         category: courseEntity.category,
  //         createdAt: courseEntity.createdAt,
  //         status: courseEntity.status,
  //         totalLesson: courseEntity.lessonCourses.length,
  //         completedLesson: completedLessons,
  //         lessons: courseEntity.lessonCourses.map((lc) => ({
  //           ...LessonMapper.toDto(lc.lesson),
  //           isCompleted: lc.lesson.userLessons?.[0]?.isCompleted || false,
  //         })),
  //         isMyCourse: userId
  //           ? await this.checkIsMyCourse(userId, courseEntity.id)
  //           : false,
  //       };

  //       return courseDetail;
  //     }),
  //   );

  //   return {
  //     data: mappedCourses.filter(
  //       (course) => course !== null,
  //     ) as CourseWithDetailsDTO[],
  //     total,
  //     page: paginationOptions?.page || 1,
  //     limit: paginationOptions?.limit || total,
  //     totalPages: paginationOptions
  //       ? Math.ceil(total / paginationOptions.limit)
  //       : 1,
  //   };
  // }
  async getListCourse(params: {
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
  }> {
    const {
      status,
      userId,
      invoiceId,
      categoryId,
      paginationOptions,
      orderBy,
      isMyCourse,
      search,
    } = params;

    const queryBuilder = this.courseRepository
      .createQueryBuilder("course")
      .leftJoinAndSelect("course.photo", "photo")
      .leftJoinAndSelect("course.category", "category")
      .leftJoinAndSelect(
        "course.userCourses",
        "userCourse",
        "userCourse.userId = :userId",
        {
          userId: userId ? Number(userId) : null,
        },
      );

    if (invoiceId && isUUID(invoiceId)) {
      queryBuilder
        .leftJoin("course.invoiceProducts", "invoiceProducts")
        .leftJoin(
          "invoice",
          "invoice",
          "invoice.id = invoiceProducts.invoiceId",
        )
        .andWhere("invoice.id = :invoiceId", { invoiceId });
    }

    if (categoryId && isUUID(categoryId)) {
      queryBuilder.andWhere("category.id = :categoryId", { categoryId });
    }

    if (status) {
      queryBuilder.andWhere("course.status = :status", { status });
    }

    // if (search) {
    //   queryBuilder.andWhere(
    //     "(course.name LIKE :search OR course.description LIKE :search)",
    //     { search: `%${search}%` },
    //   );
    // }
    if (search) {
      // queryBuilder.andWhere(
      //   "CONVERT(course.name USING utf8) COLLATE utf8_general_ci LIKE :search OR CONVERT(course.description USING utf8) COLLATE utf8_general_ci LIKE :search",
      //   { search: `%${search}%` },
      // );
      queryBuilder.andWhere(
        "course.name ILIKE :search OR course.description ILIKE :search",
        { search: `%${search}%` },
      );
    }

    if (isMyCourse !== undefined && userId) {
      if (isMyCourse) {
        queryBuilder.andWhere("userCourse.id IS NOT NULL");
      } else {
        queryBuilder.andWhere("userCourse.id IS NULL");
      }
    }

    const validColumns = [
      "id",
      "name",
      "price",
      "description",
      "status",
      "createdAt",
      "updatedAt",
      "photo",
    ];

    if (orderBy && Object.keys(orderBy).length > 0) {
      Object.entries(orderBy).forEach(([key, value]) => {
        if (validColumns.includes(key)) {
          queryBuilder.addOrderBy(`course.${key}`, value);
        }
      });
    } else {
      queryBuilder.orderBy("course.createdAt", "DESC");
    }

    queryBuilder.addOrderBy("course.id", "ASC");

    const total = await queryBuilder.getCount();

    if (paginationOptions) {
      const { page, limit } = paginationOptions;
      queryBuilder.skip((page - 1) * limit).take(limit);
    }

    const courses = await queryBuilder.getMany();

    const mappedCourses = await Promise.all(
      courses.map(async (course) => {
        const courseEntity = await this.courseRepository
          .createQueryBuilder("course")
          .leftJoinAndSelect("course.category", "category")
          .leftJoinAndSelect("course.photo", "photo")
          .leftJoinAndSelect("course.lessonCourses", "lessonCourse")
          .leftJoinAndSelect("lessonCourse.lesson", "lesson")
          .leftJoinAndSelect(
            "lesson.userLessons",
            "userLesson",
            "userLesson.userId = :userId",
            { userId: userId ? Number(userId) : null },
          )
          .where("course.id = :id", { id: course.id })
          .getOne();

        if (!courseEntity) return null;

        const completedLessons = courseEntity.lessonCourses.filter(
          (lc) => lc.lesson.userLessons?.[0]?.isCompleted,
        ).length;

        const courseDetail: CourseWithDetailsDTO = {
          id: courseEntity.id,
          title: courseEntity.name,
          price: courseEntity.price,
          description: courseEntity.description,
          photo: courseEntity.photo,
          category: courseEntity.category,
          createdAt: courseEntity.createdAt,
          status: courseEntity.status,
          totalLesson: courseEntity.lessonCourses.length,
          completedLesson: completedLessons,
          lessons: courseEntity.lessonCourses.map((lc) => ({
            ...LessonMapper.toDto(lc.lesson),
            isCompleted: lc.lesson.userLessons?.[0]?.isCompleted || false,
          })),
          isMyCourse: !!course.userCourses?.[0],
        };

        return courseDetail;
      }),
    );

    return {
      data: mappedCourses.filter(
        (course) => course !== null,
      ) as CourseWithDetailsDTO[],
      total,
      page: paginationOptions?.page || 1,
      limit: paginationOptions?.limit || total,
      totalPages: paginationOptions
        ? Math.ceil(total / paginationOptions.limit)
        : 1,
    };
  }
}
