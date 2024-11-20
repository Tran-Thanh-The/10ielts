import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
  } from "@nestjs/common";
  import { Reflector } from "@nestjs/core";
  import { RoleEnum } from "../../roles/roles.enum";
import { log } from "console";
  
  @Injectable()
  export class RolesRestrictionGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}
  
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const body = request.body;
      
        if (!user) {
          throw new ForbiddenException("User is missing.");
        }
      
        const userRole = user.role?.id; // Vai trò hiện tại của user
        const targetRole = body.role?.id; // Vai trò mới (nếu có)
      
        if (userRole === RoleEnum.admin) {
          return true;
        }
      
        if (!targetRole) {
          return true;
        }
      
        if (
          (userRole === RoleEnum.teacher || userRole === RoleEnum.staff) &&
          targetRole === RoleEnum.user
        ) {
          return true;
        }
      
        throw new ForbiddenException("You do not have permission to perform this action.");
      }      
  }
  