import axiosInstance from '@/core/intercepter/Intercepter';
import { LessonRequest as Lesson } from '@/types/interface/Lesson';
import { PaginatedResponse } from '@/types/interface/PaginatedResponse';
import { PaginationParams } from '@/types/interface/PaginationParams';
import { API_LESSON } from '@/utils/constants/constants';

const lessonApi = {
  // API: Tạo bài học mới
  createLesson: (lesson: Lesson, idCourse: string) => {
    const url = `${API_LESSON.CREATE}/${idCourse}`;
    return axiosInstance.post<Lesson>(url, lesson, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // API: Cập nhật bài học
  updateLesson: (lessonId: string, lesson: Lesson) => {
    // const url = `${API_LESSON.UPDATE}/${lessonId}`;
    return axiosInstance.patch<Lesson>(`lessons/${lessonId}`, lesson);
  },

  // API: Lấy thông tin bài học
  getLesson: (lessonId: string) => {
    const url = `${API_LESSON.READ}/${lessonId}`;
    return axiosInstance.get<Lesson>(url);
  },

  // API: Lấy danh sách bài học (với phân trang)
  // getLessons: (params: PaginationParams = {}) => {
  //   const url = API_LESSON.READ;
  //   return axiosInstance.get<PaginatedResponse<Lesson>>(url, { params });
  // },

  // API: Xóa bài học
  deleteLesson: (lessonId: string) => {
    const url = `${API_LESSON.DELETE}/${lessonId}`;
    return axiosInstance.delete(url);
  },

  // API: Tìm kiếm bài học (với phân trang)
  searchLessons: (searchTerm: string, params: PaginationParams = {}) => {
    const url = API_LESSON.SEARCH;
    return axiosInstance.get<PaginatedResponse<Lesson>>(url, {
      params: {
        q: searchTerm,
        ...params,
      },
    });
  },
};

export default lessonApi;
