import { PermissionEnum } from '@/types/enum/account.enum';
import { EPracticeFilter } from '@/types/enum/practice.enum';

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

export const LESSONS_PER_PAGE = 10;

export const ROLES = [
  { id: 1, name: 'Admin' },
  { id: 2, name: 'Staff' },
  { id: 3, name: 'User' },
];

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
    disabled: false,
    icon: 'https://api.prep.vn/images/skills/test_practice/writing.png',
  },
  {
    title: 'Speaking',
    value: EPracticeFilter.SPEAKING,
    disabled: false,
    icon: 'https://api.prep.vn/images/skills/test_practice/speaking.png',
  },
];

export const DEFAULT_PERMISSIONS = [
  PermissionEnum.CREATE_LESSON,
  PermissionEnum.READ_LESSON,
  PermissionEnum.UPDATE_LESSON,
  PermissionEnum.DELETE_LESSON,
  PermissionEnum.CREATE_QUESTION,
  PermissionEnum.READ_QUESTION,
  PermissionEnum.UPDATE_QUESTION,
  PermissionEnum.DELETE_QUESTION,
  PermissionEnum.CREATE_ANSWER,
  PermissionEnum.READ_ANSWER,
  PermissionEnum.UPDATE_ANSWER,
  PermissionEnum.DELETE_ANSWER,
  PermissionEnum.CREATE_CATEGORY,
  PermissionEnum.READ_CATEGORY,
  PermissionEnum.UPDATE_CATEGORY,
  PermissionEnum.DELETE_CATEGORY
];

const ALL_PERMISSIONS = [
  PermissionEnum.CREATE_USER,
  PermissionEnum.READ_USER,
  PermissionEnum.UPDATE_USER,
  PermissionEnum.DELETE_USER,
  PermissionEnum.CREATE_COURSE,
  PermissionEnum.READ_COURSE,
  PermissionEnum.UPDATE_COURSE,
  PermissionEnum.DELETE_COURSE,
  PermissionEnum.CREATE_PRACTICE,
  PermissionEnum.READ_PRACTICE,
  PermissionEnum.UPDATE_PRACTICE,
  PermissionEnum.DELETE_PRACTICE,
  PermissionEnum.ACCESS_CHAT,
];

export const ROLE_FORM = [
  {
    label: 'Quyền quản lý học sinh',
    permissons: [
      PermissionEnum.CREATE_USER,
      PermissionEnum.READ_USER,
      PermissionEnum.UPDATE_USER,
      PermissionEnum.DELETE_USER,
    ],
    children: [
      {
        label: 'Quyền xem danh sách học sinh',
        permissions: [PermissionEnum.READ_USER],
      },
      {
        label: 'Quyền thêm, sửa học sinh',
        permissions: [PermissionEnum.CREATE_USER, PermissionEnum.UPDATE_USER],
      },
      {
        label: 'Quyền xóa học sinh',
        permissions: [PermissionEnum.DELETE_USER],
      },
    ],
  },
  {
    label: 'Quyền quản lý khóa học',
    permissons: [
      PermissionEnum.CREATE_COURSE,
      PermissionEnum.READ_COURSE,
      PermissionEnum.UPDATE_COURSE,
      PermissionEnum.DELETE_COURSE,
    ],
    children: [
      {
        label: 'Quyền xem danh sách khóa học',
        permissions: [PermissionEnum.READ_COURSE],
      },
      {
        label: 'Quyền thêm, sửa khóa học',
        permissions: [PermissionEnum.CREATE_COURSE, PermissionEnum.UPDATE_COURSE],
      },
      {
        label: 'Quyền xóa khóa học',
        permissions: [PermissionEnum.DELETE_COURSE],
      },
    ],
  },
  {
    label: 'Quyền quản lý luyện tập',
    permissons: [
      PermissionEnum.CREATE_PRACTICE,
      PermissionEnum.READ_PRACTICE,
      PermissionEnum.UPDATE_PRACTICE,
      PermissionEnum.DELETE_PRACTICE,
    ],
    children: [
      {
        label: 'Quyền xem danh sách luyện tập',
        permissions: [PermissionEnum.READ_PRACTICE],
      },
      {
        label: 'Quyền thêm, sửa luyện tập',
        permissions: [PermissionEnum.CREATE_PRACTICE, PermissionEnum.UPDATE_PRACTICE],
      },
      {
        label: 'Quyền xóa luyện tập',
        permissions: [PermissionEnum.DELETE_PRACTICE],
      },
    ],
  },
  {
    label: 'Quyền sử dung chat',
    permissons: [PermissionEnum.ACCESS_CHAT],
  },
  {
    label: 'Quyền xem thống kê',
    permissons: [PermissionEnum.ACCESS_STATISTIC],
  },
  {
    label: 'Quyền quản lý hóa đơn',
    permissons: [PermissionEnum.ACCESS_PAYMENT],
  }
];
