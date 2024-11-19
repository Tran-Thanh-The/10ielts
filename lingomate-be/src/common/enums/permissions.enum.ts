export enum Permission {
     // System-wide permissions
     MANAGE_ALL = 'manage:all',
     
     // Courses
     CREATE_COURSE = 'course:create',
     READ_COURSE = 'course:read',
     UPDATE_COURSE = 'course:update',
     DELETE_COURSE = 'course:delete',
     
     // Lessons
     CREATE_LESSON = 'lesson:create',
     READ_LESSON = 'lesson:read',
     UPDATE_LESSON = 'lesson:update',
     DELETE_LESSON = 'lesson:delete',
     
     // Questions
     CREATE_QUESTION = 'question:create',
     READ_QUESTION = 'question:read',
     UPDATE_QUESTION = 'question:update',
     DELETE_QUESTION = 'question:delete',

     // Answers
     CREATE_ANSWER = 'answer:create',
     READ_ANSWER = 'answer:read',
     UPDATE_ANSWER = 'answer:update',
     DELETE_ANSWER = 'answer:delete',

     // Categories
     CREATE_CATEGORY = 'category:create',
     READ_CATEGORY = 'category:read',
     UPDATE_CATEGORY = 'category:update',
     DELETE_CATEGORY = 'category:delete',

     // Practice Exercises
     CREATE_PRACTICE = 'practice:create',
     READ_PRACTICE = 'practice:read',
     UPDATE_PRACTICE = 'practice:update',
     DELETE_PRACTICE = 'practice:delete',
     
     // Answer Histories
     CREATE_ANSWER_HISTORY = 'answer-history:create',
     READ_ANSWER_HISTORY = 'answer-history:read',
     UPDATE_ANSWER_HISTORY = 'answer-history:update',
     DELETE_ANSWER_HISTORY = 'answer-history:delete',
     
     // Users
     CREATE_USER = 'user:create',
     READ_USER = 'user:read',
     READ_USER_BY_ID = 'user:readById',
     UPDATE_USER = 'user:update',
     DELETE_USER = 'user:delete',
  }
  