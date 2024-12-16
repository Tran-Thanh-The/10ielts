import { LessonTypes } from '../enum/LessonType';
export interface LessonResponse {
  id: string;
  title: string;
  lessonType: LessonTypes;
  sections?: number;
  totalSections?: number;
  stars?: number;
  totalStars?: number;
  content?: string;
}
export interface LessonRequest {
  id?: string;
  title?: string;
  content?: string;
  videoUrl?: File | null;
  lessonType?: LessonTypes;
}

// export interface LessonRequest {
//   lessonDetails?: {
//     title?: string;
//     content?: string;
//     lessonType?: LessonTypes;
//   };
//   video?: {
//     videoUrl?: File | null;
//   };
// }
