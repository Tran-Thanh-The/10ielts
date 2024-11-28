import { PermissionEnum } from "@/common/enums/permissions.enum";
import { hasImplicitPermissions } from "@/utils/permission-utils";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class PermissionGuard implements CanActivate {

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<PermissionEnum[]>(
      'permissions',
      [context.getHandler(), context.getClass()]
    );

    if (!requiredPermissions) {
      console.log("No permissions required, access granted");
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.permissions) {
      console.log("User or permissions not found, access denied");
      return false;
    }

    let hasPermission = true;
    for (const permission of requiredPermissions) {
      const permissionGranted = hasImplicitPermissions(user.permissions, permission, user.role);

      if (!permissionGranted) {
        console.log(`Permission '${permission}' denied for user role '${JSON.stringify(user.role)}'`);
      } else {
        console.log(`Permission '${permission}' granted for user role '${JSON.stringify(user.role)}'`);
      }

      hasPermission = hasPermission && permissionGranted;
    }

    if (!hasPermission) {
      console.log("Access denied, user does not have the required permissions");
    }

    return hasPermission;
  }
}
