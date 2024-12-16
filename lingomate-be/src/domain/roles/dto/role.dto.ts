import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";
import { Role } from "../domain/role";
import { PermissionEnum } from "@/common/enums/permissions.enum";

export class RoleDto implements Role  {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  name?: string;
  @ApiPropertyOptional({
    type: [String],
    description: "List of permissions associated with the role.",
  })
  @IsOptional()
  permissions?: PermissionEnum[];

}
