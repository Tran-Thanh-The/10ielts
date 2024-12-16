import { PermissionEnum } from "@/common/enums/permissions.enum";

export function hasImplicitPermissions(
  userPermissions: PermissionEnum[],
  requiredPermission: PermissionEnum,
  userRole?: any,
): boolean {
  const isAdmin = 
    userRole?.name?.toLowerCase() === "admin" || 
    userRole?.id === 1;

  if (isAdmin || !requiredPermission) {
    return true;
  }

  const rolePermissions = userRole?.permissions || userPermissions;
  switch (requiredPermission) {
    case PermissionEnum.CREATE_USER:
      return rolePermissions.includes(PermissionEnum.CREATE_USER);

    case PermissionEnum.CREATE_LESSON:
    case PermissionEnum.READ_LESSON:
      return (
        rolePermissions.includes(PermissionEnum.READ_LESSON) ||
        rolePermissions.includes(PermissionEnum.CREATE_COURSE)
      );
    case PermissionEnum.UPDATE_LESSON:
    case PermissionEnum.DELETE_LESSON:
      return rolePermissions.includes(PermissionEnum.CREATE_COURSE);

    case PermissionEnum.CREATE_QUESTION:
    case PermissionEnum.READ_QUESTION:
      return (
        rolePermissions.includes(PermissionEnum.READ_QUESTION) ||
        rolePermissions.includes(PermissionEnum.CREATE_COURSE)
      );
    case PermissionEnum.UPDATE_QUESTION:
    case PermissionEnum.DELETE_QUESTION:
      return rolePermissions.includes(PermissionEnum.CREATE_COURSE);

    case PermissionEnum.CREATE_ANSWER:
    case PermissionEnum.READ_ANSWER:
      return (
        rolePermissions.includes(PermissionEnum.READ_ANSWER) ||
        rolePermissions.includes(PermissionEnum.CREATE_COURSE)
      );
    case PermissionEnum.UPDATE_ANSWER:
    case PermissionEnum.DELETE_ANSWER:
      return rolePermissions.includes(PermissionEnum.CREATE_COURSE);

    case PermissionEnum.CREATE_PRACTICE:
    case PermissionEnum.READ_PRACTICE:
    case PermissionEnum.UPDATE_PRACTICE:
    case PermissionEnum.DELETE_PRACTICE:
      return rolePermissions.includes(PermissionEnum.CREATE_PRACTICE);
    
    case PermissionEnum.CREATE_ROLE:
    case PermissionEnum.READ_ROLE:
    case PermissionEnum.UPDATE_ROLE:
    case PermissionEnum.DELETE_ROLE:
      return rolePermissions.includes(PermissionEnum.CREATE_ROLE);  
    default:
      return rolePermissions.includes(requiredPermission);
  }
}
