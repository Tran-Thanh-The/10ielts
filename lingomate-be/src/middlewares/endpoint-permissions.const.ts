import { Permission } from "@/common/enums/permissions.enum";

export const ENDPOINT_PERMISSIONS: Record<string, Permission> = {
  // Courses
  "GET:/api/v1/courses": Permission.READ_COURSE,
  "POST:/api/v1/courses": Permission.CREATE_COURSE,
  "PATCH:/api/v1/courses/:id": Permission.UPDATE_COURSE,
  "DELETE:/api/v1/courses/:id": Permission.DELETE_COURSE,

  // Lessons
  "GET:/api/v1/lessons": Permission.READ_LESSON,
  "POST:/api/v1/lessons": Permission.CREATE_LESSON,
  "PATCH:/api/v1/lessons/:id": Permission.UPDATE_LESSON,
  "DELETE:/api/v1/lessons/:id": Permission.DELETE_LESSON,

  // Practice Exercises
  "GET:/api/v1/practice-exercises": Permission.READ_PRACTICE,
  "POST:/api/v1/practice-exercises": Permission.CREATE_PRACTICE,
  "PATCH:/api/v1/practice-exercises/:id": Permission.UPDATE_PRACTICE,
  "DELETE:/api/v1/practice-exercises/:id": Permission.DELETE_PRACTICE,

  // Questions
  "GET:/api/v1/questions": Permission.READ_QUESTION,
  "POST:/api/v1/questions": Permission.CREATE_QUESTION,
  "PATCH:/api/v1/questions/:id": Permission.UPDATE_QUESTION,
  "DELETE:/api/v1/questions/:id": Permission.DELETE_QUESTION,

  // Answers
  "GET:/api/v1/answers": Permission.READ_ANSWER,
  "POST:/api/v1/answers": Permission.CREATE_ANSWER,
  "PATCH:/api/v1/answers/:id": Permission.UPDATE_ANSWER,
  "DELETE:/api/v1/answers/:id": Permission.DELETE_ANSWER,

  // Answer Histories
  "GET:/api/v1/answer-histories": Permission.READ_ANSWER_HISTORY,
  "POST:/api/v1/answer-histories": Permission.CREATE_ANSWER_HISTORY,
  "PATCH:/api/v1/answer-histories/:id": Permission.UPDATE_ANSWER_HISTORY,
  "DELETE:/api/v1/answer-histories/:id": Permission.DELETE_ANSWER_HISTORY,

  // Categories
  "GET:/api/v1/categories": Permission.READ_CATEGORY,
  "POST:/api/v1/categories": Permission.CREATE_CATEGORY,
  "PATCH:/api/v1/categories/:id": Permission.UPDATE_CATEGORY,
  "DELETE:/api/v1/categories/:id": Permission.DELETE_CATEGORY,

  // Users
  "GET:/api/v1/users": Permission.READ_USER,
  "GET:/api/v1/users/:id": Permission.READ_USER_BY_ID,
  "POST:/api/v1/users": Permission.CREATE_USER,
  "PATCH:/api/v1/users/:id": Permission.UPDATE_USER,
  "DELETE:/api/v1/users/:id": Permission.DELETE_USER,
};
