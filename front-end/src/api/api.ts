import axiosInstance from '@/core/intercepter/Intercepter';

export const getRevenue = async (year: number) => {
  return axiosInstance.get<any>(`statistical/revenue?year=${year}`);
};

export const getCourseStatistic = async (year: number) => {
  return axiosInstance.get<any>(
    `statistical/all-courses-register-statistics?year=${year}`,
  );
};

export const getCourseRegisterStatistic = async (
  year: number,
  month: number,
) => {
  return axiosInstance.get<any>(
    `statistical/monthly-courses-register-statistics?year=${year}&month=${month}`,
  );
};

export const getUsers = async () => {
  return axiosInstance.get<any>('users?page=1&&limit=10');
};

export const createUser = async (data: any) => {
  return axiosInstance.post<any>('users', data);
};

export const updateUser = async (id: number, data: any) => {
  return axiosInstance.patch<any>(`users/${id}`, data);
};

export const deleteUser = async (id: number) => {
  return axiosInstance.delete<any>(`users/${id}`);
};

export const getLessonDetailsById = async (id: string) => {
  return axiosInstance.get<any>(`lessons/${id}`);
};

export const getLessonDetailsByIdV2 = async (id: string) => {
  return axiosInstance.get<any>(`lessons/${id}/detail`);
};

export const createQuestion = async (data: any) => {
  return axiosInstance.post<any>('questions', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const createQuestionAnswer = async (questionId: string, data: any) => {
  return axiosInstance.post<any>(`answers/${questionId}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteQuestion = async (questionId: string) => {
  return axiosInstance.delete<any>(`questions/${questionId}`);
};

export const getRoles = async () => {
  return axiosInstance.get<any>('roles');
};

export const submitCourseLesson = async (data: any) => {
  return axiosInstance.post<any>('answer-histories', data);
};

export const getAnswerHistories = async () => {
  return axiosInstance.get<any>('answer-histories', {
    params: {
      pages: 1,
      limit: 1000,
    },
  });
};

export const createPractice = async (data: any) => {
  return axiosInstance.post<any>('practice-exercises', data);
};

export const updatePractice = async (id: string, data: any) => {
  return axiosInstance.patch<any>(`practice-exercises/${id}`, data);
};

export const getPracticeExercises = async () => {
  return axiosInstance.get<any>('practice-exercises', {
    params: {
      pages: 1,
      limit: 1000,
    },
  });
};

export const getPracticeExerciseById = async (id: string) => {
  return axiosInstance.get<any>(`practice-exercises/${id}`);
};
