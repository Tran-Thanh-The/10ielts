import axiosInstance from '@/core/intercepter/Intercepter';

const courseApi = {
  getCategories: () => {
    return axiosInstance.get<any>('/categories');
  },
  getCourses: ({ params }) => {
    return axiosInstance.get<any>('/courses/list', {
      params: {
        ...params,
      },
    });
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
