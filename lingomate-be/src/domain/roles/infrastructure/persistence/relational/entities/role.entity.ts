import { PermissionEnum } from "@/common/enums/permissions.enum";
import { EntityRelationalHelper } from "@/utils/relational-entity-helper";
import { ApiProperty } from "@nestjs/swagger";
import {
  Column,
  Entity,
  PrimaryGeneratedColumn
} from "typeorm";

@Entity({
  name: "role",
})
export class RoleEntity extends EntityRelationalHelper {
  @ApiProperty({
    type: Number,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    type: String,
    example: "admin",
  })
  @Column()
  name?: string;

  @Column("simple-array", { nullable: true })
  @ApiProperty({
    type: [String],
    description: "List of permissions associated with the role.",
  })
  permissions?: PermissionEnum[];

}
