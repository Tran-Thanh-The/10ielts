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

export interface StudentRegisterByMonthByYearResponse {
  courseId: string;
  courseName: string;
  data: {
    month: number;
    registrationCount: number;
  }[];
}

export interface RawStudentRegisterRow {
  id: string;
  course_name: string;
  month: number;
  registration_count: number;
}

export interface AllCoursesRegisterStatisticsResponse {
  month: number;
  registrationCount: number;
}
