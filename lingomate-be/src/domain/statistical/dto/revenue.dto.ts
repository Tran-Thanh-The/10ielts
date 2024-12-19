export interface RevenueByMonthOfAYearResponse {
  month: number;
  notPay: number;
  payed: number;
}

export interface RawRevenueRow {
  month: number;
  notPay: string;
  payed: string;
}
