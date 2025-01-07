import { IPhoto } from '@/types/interface/common.interface';
import { LessonResponse } from './Lesson';
import { ICategory } from '@/types/interface/Category';

export interface CourseResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  createdAt: Date;
  totalLesson: number;
  completedLesson: number;
  isMyCourse: boolean;
  lessons: LessonResponse[];
  photo: IPhoto;
  category: ICategory;
  status: StatusCourse;
}

export enum StatusCourse {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}
export interface Course {
  id: string;
  name: string;
  title: string;
  description: string;
  price: number;
  createAt: Date | string;
  totalLesson: number;
  completedLesson: number;
  isMyCourse: boolean;
  photo: {
    id: string;
    path: string;
  };
  status?: string;
}

export interface CourseParams {
  status?: string;
  userId?: string;
  invoiceId?: string;
  paginationOptions: {
    page: number;
    limit: number;
  };
  search?: string;
  isMyCourse?: string;
  orderBy?: { [key: string]: 'ASC' | 'DESC' };
  categoryId?: string;
  page: any;
  limit: any;
}
