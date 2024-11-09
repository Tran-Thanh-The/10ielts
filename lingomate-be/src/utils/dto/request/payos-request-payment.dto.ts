export interface Items {
  name: string;
  quantity: number;
  price: number;
}

export interface CreatePaymentDto {
  orderCode: number;
  amount: number;
  description: string;
  items?: Items[];
  buyerName?: string;
  buyerEmail?: string;
  buyerPhone?: string;
  buyerAddress?: string;
  expiredAt?: number;
}
