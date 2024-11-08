import axiosInstance from "@/core/intercepter/Intercepter";

export const getUsers = async () => {
  return axiosInstance.get<any>('users?page=1&&limit=10');
}

export const createUser = async (data: any) => {
  return axiosInstance.post<any>('users', data);
}

export const updateUser = async (id: number, data: any) => {
  return axiosInstance.patch<any>(`users/${id}`, data);
}

export const deleteUser = async (id: number) => {
  return axiosInstance.delete<any>(`users/${id}`);
}