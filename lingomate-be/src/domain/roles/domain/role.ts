import { PermissionEnum } from "@/common/enums/permissions.enum";
import { ApiProperty } from "@nestjs/swagger";
import { Allow } from "class-validator";

const idType = Number;
export class Role {
  @Allow()
  @ApiProperty({
    type: idType,
  })
  id: number | string;

  @Allow()
  @ApiProperty({
    type: String,
    example: "admin",
  })
  name?: string;

  @Allow()
  @ApiProperty({
    type: [String],
    description: "List of permissions associated with the role.",
  })
  permissions?: PermissionEnum[];
}
