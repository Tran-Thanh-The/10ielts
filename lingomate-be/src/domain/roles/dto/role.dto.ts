import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";
import { Role } from "../domain/role";

export class RoleDto implements Role {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  name?: string;
}
