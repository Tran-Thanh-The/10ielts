import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from "@nestjs/common";
import { RoleEnum } from "../../../common/enums/roles.enum";

@Injectable()
export class RolesRestrictionGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const body = request.body;

    if (!user) {
      throw new ForbiddenException("User is missing.");
    }

    const userRole = user.role?.id;

    if (userRole === RoleEnum.admin) {
      return true;
    }

    if (userRole !== RoleEnum.admin) {
      body.role = { id: RoleEnum.user };
      return true;
    }

    throw new ForbiddenException(
      "You do not have permission to perform this action.",
    );
  }
}
