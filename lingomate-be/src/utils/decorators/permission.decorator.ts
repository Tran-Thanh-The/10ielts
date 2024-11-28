import { PermissionEnum } from "@/common/enums/permissions.enum";
import { SetMetadata } from "@nestjs/common";

export const Permissions = (...permissions: PermissionEnum[]) => 
    SetMetadata('permissions', permissions);