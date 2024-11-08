export const API_ENDPOINT = {
  ACCESS_TOKEN_KEY: 'ttb_atk',
  REFRESH_TOKEN_KEY: 'refresh_token',
  REFRESH_TOKEN: '/auth/refresh',
  VERIFY_TOKEN: 'verify_token',
  LOGIN: '/auth/email/login',
  LOGOUT: '/auth/logout',
  REGISTER: '/auth/email/register',
  VERIFY: '/auth/email/confirm',
  USER: '/user',
  COURSE: '/course',
} as const;

export const API_LESSON = {
  CREATE: '/lessons',
  UPDATE: (id: string) => `/lessons/${id}`,
  READ: (id: string) => `/lessons/${id}`,
  DELETE: '/lessons',
  SEARCH: 'lessons/search',
} as const;

export const ROLE = {
  USER: 'User',
  ADMIN: 'Admin',
  STAFF: 'Staff',
} as const;

export const TYPE_LESSON = {
  VIDEO: 'Video',
  DOCS: 'Docs',
  EXAMPLE: 'Example',
};

export type Role = (typeof ROLE)[keyof typeof ROLE];

export const LESSONS_PER_PAGE = 5;

export const ROLES = [
  { id: 1, name: 'Admin' },
  { id: 2, name: 'Staff' },
  { id: 3, name: 'User' },
]
