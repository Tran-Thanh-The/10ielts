import { Permission } from '@/common/enums/permissions.enum';
import { RoleEnum as Role } from '@/domain/roles/roles.enum';

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
    [Role.admin]: [Permission.MANAGE_ALL],
    [Role.teacher]: [
      // Courses
      Permission.READ_COURSE,
      Permission.UPDATE_COURSE,

      // Lessons
      Permission.CREATE_LESSON,
      Permission.READ_LESSON,
      Permission.UPDATE_LESSON,
      Permission.DELETE_LESSON,

      // Practice Exercises
      Permission.CREATE_PRACTICE,
      Permission.READ_PRACTICE,
      Permission.UPDATE_PRACTICE,
      Permission.DELETE_PRACTICE,
      
      // Questions
      Permission.CREATE_QUESTION,
      Permission.READ_QUESTION,
      Permission.UPDATE_QUESTION,
      Permission.DELETE_QUESTION,
      
      // Answers
      Permission.READ_ANSWER,
      Permission.UPDATE_ANSWER,

      // Answers History
      Permission.READ_ANSWER_HISTORY,
      Permission.CREATE_ANSWER_HISTORY,
      Permission.UPDATE_ANSWER_HISTORY,
      Permission.DELETE_ANSWER_HISTORY,

      // Categories
      Permission.READ_CATEGORY,
      Permission.CREATE_CATEGORY,
      Permission.UPDATE_CATEGORY,
      Permission.DELETE_CATEGORY,

      // Users
      Permission.READ_USER
    ],

    [Role.staff]: [
      Permission.READ_COURSE,
      Permission.READ_LESSON,
      Permission.READ_PRACTICE,
      Permission.READ_QUESTION,
      Permission.READ_ANSWER,
      Permission.READ_ANSWER_HISTORY,
      Permission.READ_CATEGORY,

      //Users
      Permission.CREATE_USER,
      Permission.UPDATE_USER,
      Permission.READ_USER,
      Permission.DELETE_USER,
    ],

    [Role.user]: [
      Permission.READ_USER_BY_ID,
      Permission.READ_PRACTICE,
      Permission.READ_QUESTION,
      Permission.READ_LESSON,
      Permission.READ_COURSE,
      Permission.CREATE_ANSWER,
      Permission.READ_ANSWER,
      Permission.CREATE_ANSWER_HISTORY,
      Permission.READ_ANSWER_HISTORY,
    ],
};
