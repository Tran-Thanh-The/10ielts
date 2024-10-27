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
}
