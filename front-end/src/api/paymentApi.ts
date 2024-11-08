import axiosInstance from '@/core/intercepter/Intercepter';

const paymentApi = {
  postPayment: (type: string, courseId: string) => {
    const url = '';
    return axiosInstance.post(url, { type, courseId });
  },
};

export default paymentApi;
