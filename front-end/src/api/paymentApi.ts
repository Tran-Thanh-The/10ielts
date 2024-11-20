import axiosInstance from '@/core/intercepter/Intercepter';

const paymentApi = {
  postPayment: (type: string, id: string) => {
    const url = '/payment/create-embedded-payment';
    return axiosInstance.post(url, { type, id });
  },
};

export default paymentApi;
