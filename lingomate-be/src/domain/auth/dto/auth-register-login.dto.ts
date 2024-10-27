import { RoleDto } from "@/domain/roles/dto/role.dto";
import { lowerCaseTransformer } from "@/utils/transformers/lower-case.transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsOptional, MinLength } from "class-validator";

export class AuthRegisterLoginDto {
  @ApiProperty({ example: "test1@example.com", type: String })
  @Transform(lowerCaseTransformer)
  @IsEmail()
  email: string;

  @ApiProperty()
  @MinLength(6)
  password: string;

  @ApiProperty()
  @MinLength(6)
  confirmPassword: string;

  @ApiProperty({ example: "John Doe" })
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    example: new Date("1990-01-01"),
    type: Date,
  })
  @IsNotEmpty()
  dob: Date;

  @ApiPropertyOptional({
    type: () => RoleDto,
  })
  @IsOptional()
  @Type(() => RoleDto)
  role?: RoleDto | null;
}
