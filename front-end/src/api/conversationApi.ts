import axiosInstance from "@/core/intercepter/Intercepter"

interface PaginationQuery {
  page: number;
  limit: number;
  search?: string;
}

const conversationApis = {
  getCurrentUserConversations: async () => {
    return axiosInstance.get<any>("/conversations/current");
  },
  getAllStaffConversations: async (query: PaginationQuery) => {
    return axiosInstance.get<any>("/conversations/admin", { params: query });
  },
  getConversationMessages: async (id: string, query: PaginationQuery) => {
    return axiosInstance.get<any>(`/conversations/${id}/messages`, {
      params: query,
    });
  },
  joinConversation: async (id: string) => {
    return axiosInstance.post<any>(`/conversation/join/${id}`);
  },
  createConversation: async () => {
    return axiosInstance.post<any>("/conversation");
  }
}

export default conversationApis;