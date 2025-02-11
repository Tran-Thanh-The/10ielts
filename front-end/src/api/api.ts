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

export const getMe = async (params: any) => {
  return axiosInstance.get<any>('auth/me', {
    params: params,
  });
};

export const getUsers = async (params: any) => {
  return axiosInstance.get<any>('users', {
    params: params,
  });
};

export const getOneUser = async (userId: string) => {
  return axiosInstance.get<any>(`users/${userId}`);
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

export const submitExercice = async (data: any, headers?: any) => {
  return axiosInstance.post<any>('answer-histories', data, {
    headers: headers,
  });
};

export const getAnswerHistories = async (params?: any) => {
  return axiosInstance.get<any>('answer-histories', {
    params: {
      pages: 1,
      limit: 1000,
      ...(params || {}),
    },
  });
};

export const createPractice = async (data: any) => {
  return axiosInstance.post<any>('practice-exercises', data);
};

export const updatePractice = async (id: string, data: any) => {
  return axiosInstance.patch<any>(`practice-exercises/${id}`, data);
};

export const getPracticeExercises = async (params?: any) => {
  return axiosInstance.get<any>('practice-exercises', {
    params: {
      pages: 1,
      limit: 1000,
      ...(params || {}),
    },
  });
};

export const getPracticeExerciseById = async (id: string) => {
  return axiosInstance.get<any>(`practice-exercises/${id}`);
};

export const updateUserCouse = async (data: any) => {
  return axiosInstance.post<any>('user-lessons', data);
};

export const createCourseCategory = async (data: any) => {
  return axiosInstance.post<any>('categories', data);
};

export const deleteCourseCategory = async (id: string) => {
  return axiosInstance.delete<any>(`categories/${id}`);
};

export const deletePractice = async (id: string) => {
  return axiosInstance.delete<any>(`practice-exercises/${id}`);
};

export const getAnswerHistorieById = async (id: string) => {
  return axiosInstance.get<any>(`answer-histories/${id}`);
};

export const updateAnswerHistory = async (id: string, data: any) => {
  return axiosInstance.patch<any>(`answer-histories/${id}`, data);
};

export const getInvoiceList = async (
  page: number,
  limit: number,
  search: string = '',
) => {
  try {
    const response = await axiosInstance.get(`/invoices`, {
      params: { page, limit, search },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching invoice list:', error);
    throw error;
  }
};

export const updateInvoiceStatus = async (
  id: number,
  data: { paymentStatus: boolean },
) => {
  return await axiosInstance.patch(`/invoices/${id}`, data);
};

export const InvoiceDetails = async (id: string) => {
  return await axiosInstance.get<any>(`/invoices/${id}`);
};

export const createUserCourse = async (data: any) => {
  return axiosInstance.post<any>('user-courses', data);
};

export const createRole = async (data: any) => {
  return axiosInstance.post<any>('roles', data);
}

export const updateRole = async (id: number, data: any) => {
  return axiosInstance.patch<any>(`roles/${id}`, data);
}

export const deleteRole = async (id: number) => {
  return axiosInstance.delete<any>(`roles/${id}`);
}

export const getRoleDetail = async (id: number) => {
  return axiosInstance.get<any>(`roles/${id}`);
}

export const getAchievements = async () => {
  return axiosInstance.get<any>('statistical/user-achievement-statistics');
};


