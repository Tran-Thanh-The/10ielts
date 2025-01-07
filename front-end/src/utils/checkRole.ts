import { Role } from './constants/constants';

export const checkRole = (
  userRole: Role | null,
  allowedRoles: Role[],
): boolean => {
  if (userRole !== 'User' && userRole !== 'Admin') userRole = 'Staff';
  return allowedRoles.includes(userRole as Role);
};
