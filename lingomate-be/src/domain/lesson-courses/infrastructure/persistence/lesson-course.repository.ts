import { DeepPartial } from "@/utils/types/deep-partial.type";
import { NullableType } from "@/utils/types/nullable.type";
import { IPaginationOptions } from "@/utils/types/pagination-options";
import { LessonCourse } from "../../domain/lesson-course";
import { Lesson } from "@/domain/lessons/domain/lesson";
import { Course } from "@/domain/courses/domain/course";

export abstract class LessonCourseRepository {
  abstract create(
    data: Omit<LessonCourse, "id" | "createdAt" | "updatedAt">,
  ): Promise<LessonCourse>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<LessonCourse[]>;

  abstract findCourseByLessonId(lessonId: string): Promise<Course | null>;

  abstract findLessonByCourseIdWithPagination(
    courseId: string,
    { paginationOptions }: { paginationOptions: IPaginationOptions },
  ): Promise<Lesson[]>;

  abstract findById(
    id: LessonCourse["id"],
  ): Promise<NullableType<LessonCourse>>;

  abstract findByCourseId(
    course_id: string,
  ): Promise<NullableType<LessonCourse[]>>;

  abstract findByLessonId(
    lesson_id: string,
  ): Promise<NullableType<LessonCourse>>;

  abstract update(
    id: LessonCourse["id"],
    payload: DeepPartial<LessonCourse>,
  ): Promise<LessonCourse | null>;

  abstract remove(id: LessonCourse["id"]): Promise<void>;
  abstract save(lessonCourse: LessonCourse): Promise<void>;
  abstract findByCourseAndLesson(
    courseId: string,
    lessonId: string,
  ): Promise<NullableType<LessonCourse>>;

  abstract countActiveLessonsByCourseId(courseId: string): Promise<number>;
  abstract findActiveLessonsByCourseId(
    courseId: string,
  ): Promise<LessonCourse[]>;
}
