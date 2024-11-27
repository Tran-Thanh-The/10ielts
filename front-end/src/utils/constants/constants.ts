import { EPracticeFilter } from "@/types/enum/practice.enum";

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

export const PRACTICE_FILTER = [
  {
    title: 'Tất cả kỹ năng',
    value: EPracticeFilter.ALL,
    disabled: false,
    icon: 'https://app.prepedu.com/imgs/test-practice/ic-book.svg',
  },
  {
    title: 'Listening',
    value: EPracticeFilter.LISTENING,
    disabled: false,
    icon: 'https://api.prep.vn/images/skills/test_practice/listening.png',
  },
  {
    title: 'Reading',
    value: EPracticeFilter.READING,
    disabled: false,
    icon: 'https://api.prep.vn/images/skills/test_practice/reading.png',
  },
  {
    title: 'Writing',
    value: EPracticeFilter.WRITING,
    disabled: true,
    icon: 'https://api.prep.vn/images/skills/test_practice/writing.png',
  },
  {
    title: 'Speaking',
    value: EPracticeFilter.SPEAKING,
    disabled: true,
    icon: 'https://api.prep.vn/images/skills/test_practice/speaking.png',
  },
];
