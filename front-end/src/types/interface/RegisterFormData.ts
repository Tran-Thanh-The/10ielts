import { Dayjs } from 'dayjs';

export interface RegisterFormData {
  fullName?: string;
  dob?: Dayjs | null;
  email?: string;
  password?: string;
  confirmPassword?: string;
}
