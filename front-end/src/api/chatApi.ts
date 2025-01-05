import axiosInstance from "@/core/intercepter/Intercepter"

interface SendMessageBodyData {
  conversationId: string;
  message: string;
  attachment?: File;
}

const chatApi = {
  sendMessage: async (data: SendMessageBodyData) => {
    return axiosInstance.post<any>(
      "/chats/send-message",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )
  }
}