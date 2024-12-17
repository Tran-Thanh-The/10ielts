import { PermissionEnum } from "@/common/enums/permissions.enum";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateRoleDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    type: [String],
    description: "List of permissions associated with the role.",
  })
  @IsOptional()
  permissions?: PermissionEnum[];
}
