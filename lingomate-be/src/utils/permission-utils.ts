import { PermissionEnum } from "@/common/enums/permissions.enum";

export function hasImplicitPermissions(
  userPermissions: PermissionEnum[], 
  requiredPermission: PermissionEnum,
  userRole?: any
): boolean {
  if (userRole?.name === 'Admin') {
    return true;
  }

  const rolePermissions = userRole?.permissions || userPermissions; 

  switch (requiredPermission) {
    case PermissionEnum.CREATE_USER:
      return rolePermissions.includes(PermissionEnum.CREATE_USER);
    
    case PermissionEnum.CREATE_LESSON:
    case PermissionEnum.READ_LESSON:
    case PermissionEnum.UPDATE_LESSON:
    case PermissionEnum.DELETE_LESSON:
      return rolePermissions.includes(PermissionEnum.CREATE_COURSE);
    
    case PermissionEnum.CREATE_QUESTION:
    case PermissionEnum.READ_QUESTION:
    case PermissionEnum.UPDATE_QUESTION:
    case PermissionEnum.DELETE_QUESTION:
      return rolePermissions.includes(PermissionEnum.CREATE_COURSE);
    
    case PermissionEnum.CREATE_ANSWER:
    case PermissionEnum.READ_ANSWER:
    case PermissionEnum.UPDATE_ANSWER:
    case PermissionEnum.DELETE_ANSWER:
      return rolePermissions.includes(PermissionEnum.CREATE_COURSE);
    
    case PermissionEnum.CREATE_PRACTICE:
    case PermissionEnum.READ_PRACTICE:
    case PermissionEnum.UPDATE_PRACTICE:
    case PermissionEnum.DELETE_PRACTICE:
      return rolePermissions.includes(PermissionEnum.CREATE_PRACTICE);
    
    default:
      return rolePermissions.includes(requiredPermission);
  }
}
