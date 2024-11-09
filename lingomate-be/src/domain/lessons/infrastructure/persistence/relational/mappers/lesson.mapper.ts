import { LessonCourse } from './../../../../../lesson-courses/domain/lesson-course';
import { CreateLessonDto } from "@/domain/lessons/dto/create-lesson.dto";
import { QuestionMapper } from "@/domain/questions/infrastructure/persistence/relational/mappers/question.mapper";
import { FileMapper } from "@/files/infrastructure/persistence/relational/mappers/file.mapper";
import { Lesson } from "../../../../domain/lesson";
import { LessonEntity } from "../entities/lesson.entity";
import { LessonResponseDto } from "./../../../../dto/response-lesson.dto";
import { AnswerMapper } from "@/domain/answers/infrastructure/persistence/relational/mappers/answer.mapper";
import { CourseEntity } from '@/domain/courses/infrastructure/persistence/relational/entities/course.entity';

export class LessonMapper {
  static toDomain(raw: LessonEntity): Lesson {
    const domainEntity = new Lesson();
    domainEntity.id = raw.id;
    domainEntity.title = raw.title;
    domainEntity.content = raw.content;
    if (raw.file) {
      domainEntity.file = FileMapper.toDomain(raw.file);
    }
    domainEntity.status = raw.status;
    domainEntity.lessonType = raw.lessonType;
    domainEntity.stars = raw.stars;
    domainEntity.totalStars = raw.totalStars;
    domainEntity.isSequence = raw.isSequence;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    domainEntity.deletedAt = raw.deletedAt;

    if (raw.lessonCourses) {
      domainEntity.lessonCourses = raw.lessonCourses.map(lessonCourse => {
        const course = new LessonCourse();
        course.id = lessonCourse.id;
        course.lesson = lessonCourse.lesson;
        course.course = lessonCourse.course;
        course.status = lessonCourse.status;
        course.position = lessonCourse.position;
        course.createdAt = lessonCourse.createdAt;
        course.updatedAt = lessonCourse.updatedAt;
        return course;
      });
    }

    if (raw.questions) {
      domainEntity.questions = raw.questions.map((question) => {
        const questionDomain = QuestionMapper.toDomain(question);

        // Map từng answer trong question và loại bỏ reference đến question trong answer
        questionDomain.answers = question.answers
          ? question.answers.map((answer) => {
              const answerDomain = AnswerMapper.toDomain(answer);
              // Loại bỏ mối quan hệ ngược để tránh vòng lặp
              delete answerDomain.question;
              return answerDomain;
            })
          : [];

        return questionDomain;
      });
    }

    return domainEntity;
  }

  static toPersistence(domainEntity: Lesson): LessonEntity {
    const persistenceEntity = new LessonEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.title = domainEntity.title;
    persistenceEntity.content = domainEntity.content;
    if (domainEntity.file) {
      persistenceEntity.file = FileMapper.toPersistence(domainEntity.file);
    } else {
      persistenceEntity.file = null;
    }
    if (domainEntity.questions) {
      persistenceEntity.questions = domainEntity.questions.map((question) =>
        QuestionMapper.toPersistence(question),
      );
    } else {
      persistenceEntity.questions = [];
    }
    persistenceEntity.lessonType = domainEntity.lessonType;
    persistenceEntity.status = domainEntity.status;
    persistenceEntity.stars = domainEntity.stars;
    persistenceEntity.totalStars = domainEntity.totalStars;
    persistenceEntity.isSequence = domainEntity.isSequence;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;
    persistenceEntity.deletedAt = domainEntity.deletedAt;

    return persistenceEntity;
  }

  static toModel(dto: CreateLessonDto): Lesson {
    const model = new Lesson();
    model.title = dto.title;
    model.content = dto.content;
    model.lessonType = dto.lessonType;
    model.stars = dto.stars;
    model.totalStars = dto.totalStars;
    model.isSequence = dto.isSequence;
    return model;
  }

  static toDto(model: Lesson): LessonResponseDto {
    const dto = new LessonResponseDto();
    dto.id = model.id;
    dto.title = model.title;
    dto.content = model.content;
    if (model.file) {
      dto.file = model.file;
    }
    dto.lessonType = model.lessonType;
    dto.stars = model.stars;
    dto.totalStars = model.totalStars;
    dto.isSequence = model.isSequence;
    dto.status = model.status;
    dto.createdAt = model.createdAt;
    dto.updatedAt = model.updatedAt;

    dto.position = model.lessonCourses?.[0]?.position ?? null;

    dto.questions = model.questions
      ? model.questions.map((question) => {
          const questionDto = QuestionMapper.toDto(question);
          questionDto.answers = question.answers
            ? question.answers.map((answer) => AnswerMapper.toDto(answer))
            : [];
          return questionDto;
        })
      : [];
    return dto;
  }
}
