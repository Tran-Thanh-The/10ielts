import axiosInstance from "@/core/intercepter/Intercepter"

interface SendMessageBodyData {
  conversationId: string;
  message: string;
  attachment?: File;
}

const chatApi = {
  sendMessage: async (data: SendMessageBodyData) => {
    const formData = new FormData();
    formData.append('conversationId', data.conversationId);
    formData.append('message', data.message);
    if (data.attachment) {
      formData.append('attachment', data.attachment);
    }
  
    return axiosInstance.post('/chats/send-message', formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
}

export default chatApi;