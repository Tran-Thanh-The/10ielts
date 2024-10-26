import { StatusEnum } from "@/common/enums/status.enum";
import { CourseWithDetailsDTO } from "@/domain/courses/dto/course-details-dto";
import { CourseEntity } from "@/domain/courses/infrastructure/persistence/relational/entities/course.entity";
import { LessonMapper } from "@/domain/lessons/infrastructure/persistence/relational/mappers/lesson.mapper";
import { UserCourseEntity } from "@/domain/user-courses/infrastructure/persistence/relational/entities/user-course.entity";
import { UserLessonEntity } from "@/domain/user-lessons/infrastructure/persistence/relational/entities/user-lesson.entity";
import { NullableType } from "@/utils/types/nullable.type";
import { IPaginationOptions } from "@/utils/types/pagination-options";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { isUUID } from "class-validator";
import { Repository } from "typeorm";
import { Course } from "../../../../domain/course";
import { CourseRepository } from "../../course.repository";
import { CourseMapper } from "../mappers/course.mapper";
import { UserEntity } from "@/domain/users/infrastructure/persistence/relational/entities/user.entity";
import { CourseInvoicesEntity } from "@/domain/course-invoices/infrastructure/persistence/relational/entities/course-invoices.entity";
import { UserInvoicesEntity } from "@/domain/user-invoices/infrastructure/persistence/relational/entities/user-invoices.entity";

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
    @InjectRepository(CourseInvoicesEntity)
    private readonly courseInvoicesRepository: Repository<CourseInvoicesEntity>,
    @InjectRepository(UserInvoicesEntity)
    private readonly userInvoicesRepository: Repository<UserInvoicesEntity>,
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

  async getCourseDetailById(
    id: string,
    userId: string,
  ): Promise<CourseWithDetailsDTO | null> {
    const userIdNumber = Number(userId);

    const courseEntity = await this.courseRepository
      .createQueryBuilder("course")
      .leftJoinAndSelect("course.category", "category")
      .leftJoinAndSelect("course.lessonCourses", "lessonCourse")
      .leftJoinAndSelect("lessonCourse.lesson", "lesson")
      .leftJoinAndSelect(
        "lesson.userLesson",
        "userLesson",
        "userLesson.userId = :userId",
        { userId: userIdNumber },
      )
      .where("course.id = :id", { id })
      .getOne();

    if (!courseEntity) {
      return null;
    }

    const user = await this.userRepository.findOne({
      where: { id: userIdNumber },
      relations: ["role"],
    });

    const courseDetail: Omit<CourseWithDetailsDTO, "isMyCourse"> = {
      id: courseEntity.id,
      title: courseEntity.name,
      price: courseEntity.price,
      description: courseEntity.description,
      photo: courseEntity.photo,
      category: courseEntity.category,
      createdAt: courseEntity.createdAt,
      totalLesson: courseEntity.lessonCourses.length,
      lessons: courseEntity.lessonCourses.map((lc) =>
        LessonMapper.toDto(lc.lesson),
      ),
    };

    if (user?.role?.name?.toUpperCase() !== "USER") {
      return courseDetail;
    }

    const userInvoice = await this.userInvoicesRepository
      .createQueryBuilder("userInvoice")
      .where("userInvoice.userId = :userId", { userId: userIdNumber })
      .getOne();

    let isMyCourse = false;
    if (userInvoice) {
      const purchaseExists = await this.courseInvoicesRepository
        .createQueryBuilder("courseInvoice")
        .where("courseInvoice.userInvoicesId = :userInvoicesId", {
          userInvoicesId: userInvoice.id,
        })
        .andWhere("courseInvoice.courseId = :courseId", { courseId: id })
        .getOne();

      isMyCourse = !!purchaseExists;
    }

    return {
      ...courseDetail,
      isMyCourse,
    };
  }

  async getListCourse(params: {
    status?: StatusEnum;
    userId?: string;
    invoiceId?: string;
    paginationOptions?: IPaginationOptions;
    orderBy?: { [key: string]: "ASC" | "DESC" };
  }) {
    const { status, userId, invoiceId, paginationOptions, orderBy } = params;

    const queryBuilder = this.courseRepository.createQueryBuilder("course");
    queryBuilder.leftJoinAndSelect("course.photo", "photo");
    queryBuilder.leftJoinAndSelect("course.category", "category");

    if (userId) {
      queryBuilder.leftJoinAndSelect(
        "course.userCourses",
        "userCourse",
        "userCourse.userId = :userId",
        { userId },
      );
    }

    if (invoiceId && isUUID(invoiceId)) {
      queryBuilder
        .leftJoinAndSelect("course.courseInvoices", "courseInvoice")
        .leftJoinAndSelect("courseInvoice.userInvoices", "userInvoices")
        .andWhere("userInvoices.id = :invoiceId", { invoiceId });
    }

    if (status) {
      queryBuilder.andWhere("course.status = :status", {
        status: StatusEnum.ACTIVE,
      });
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
    const mappedCourses = courses.map((course) => ({
      ...CourseMapper.toDomain(course),
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
    }));

    return {
      data: mappedCourses,
      total,
      page: paginationOptions?.page || 1,
      limit: paginationOptions?.limit || total,
      totalPages: paginationOptions
        ? Math.ceil(total / paginationOptions.limit)
        : 1,
    };
  }
}
