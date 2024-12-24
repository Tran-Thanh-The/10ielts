import axiosInstance from '@/core/intercepter/Intercepter';
import { CourseParams } from '@/types/interface/Course';

const courseApi = {
  getCategories: () => {
    return axiosInstance.get<any>('/categories');
  },
  getCourses: ({
    status,
    userId,
    invoiceId,
    paginationOptions,
    search,
    isMyCourse,
    orderBy,
    categoryId,
  }: CourseParams) => {
    const params = {
      status,
      userId,
      invoiceId,
      page: paginationOptions?.page || 1,
      limit: paginationOptions?.limit || 10,
      search,
      isMyCourse,
      orderBy: orderBy || {},
      categoryId,
    };

    return axiosInstance.get('/courses/list', { params });
  },
  createCourse: (data: any) => {
    return axiosInstance.post('/courses', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  updateCourse: (id: string, data: any) => {
    return axiosInstance.patch<any>(`/courses/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deleteCourse: (id: string) => {
    return axiosInstance.delete<any>(`/courses/${id}`);
  },
  getCourseById: (id: string) => {
    return axiosInstance.get<any>(`/courses/${id}`);
  },
  getCourseDetailsById: (id: string) => {
    return axiosInstance.get<any>(`/courses/${id}/details`);
  },
};

export default courseApi;
