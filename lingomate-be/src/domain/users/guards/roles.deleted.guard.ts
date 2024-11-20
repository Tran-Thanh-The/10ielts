import { RoleEnum } from "@/domain/roles/roles.enum";
import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from "@nestjs/common";
import { UsersService } from "../users.service";

@Injectable()
export class DeleteUserGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const currentUser = request.user;
    const userIdToDelete = request.params.id; // ID của user cần xóa

    if (!currentUser) {
      throw new ForbiddenException("User is missing.");
    }

    const currentUserRole = currentUser.role?.id;
    if (!currentUserRole) {
      throw new ForbiddenException("User role is undefined.");
    }

    // Admin được phép xóa tất cả
    if (currentUserRole === RoleEnum.admin) {
      return true;
    }

    const userToDelete = await this.usersService.findById(userIdToDelete);

    if (!userToDelete) {
      throw new ForbiddenException("User to delete not found.");
    }

    // Teacher và Staff chỉ được xóa user mà họ tạo ra
    if (
      (currentUserRole === RoleEnum.teacher || currentUserRole === RoleEnum.staff) &&
      userToDelete.createdBy === currentUser.id
    ) {
      return true;
    }

    throw new ForbiddenException(
      "You do not have permission to delete this user.",
    );
  }
}
