import { StatusEnum } from "@/common/enums/status.enum";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { FileType } from "../../../files/domain/file";
import { Role } from "../../roles/domain/role";

const idType = Number;

export class User {
  @ApiProperty({
    type: idType,
  })
  id: number | string;

  @ApiProperty({
    type: String,
    example: "john.doe@example.com",
  })
  @Expose({ groups: ["me", "admin"] })
  email: string | null;

  @Exclude({ toPlainOnly: true })
  password?: string;

  @Exclude({ toPlainOnly: true })
  previousPassword?: string;

  @ApiProperty({
    type: String,
    example: "email",
  })
  @Expose({ groups: ["me", "admin"] })
  provider: string;

  @ApiProperty({
    type: String,
    example: "1234567890",
  })
  @Expose({ groups: ["me", "admin"] })
  socialId?: string | null;

  @ApiProperty({
    type: String,
    example: "John Doe",
  })
  fullName: string | null;

  @ApiProperty({ type: Date })
  dob?: Date | null;

  @ApiProperty({
    type: () => FileType,
  })
  photo?: FileType | null;

  @ApiProperty({
    type: () => Role,
  })
  role?: Role | null;

  @ApiPropertyOptional({
    enum: StatusEnum,
  })
  status?: StatusEnum | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;
}
