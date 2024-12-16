import { StatusEnum } from "@/common/enums/status.enum";
import { lowerCaseTransformer } from "@/utils/transformers/lower-case.transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  // decorators here
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  MinLength,
} from "class-validator";
import { FileDto } from "../../../files/dto/file.dto";
import { Role } from "@/domain/roles/domain/role";

export class CreateUserDto {
  @ApiProperty({ example: "test1@example.com", type: String })
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  @IsEmail()
  email: string | null;

  @ApiProperty()
  @MinLength(6)
  password?: string;

  provider?: string;

  socialId?: string | null;

  @ApiProperty({ example: "John Doe", type: String })
  @IsNotEmpty()
  fullName: string | null;

  @ApiPropertyOptional({ type: () => FileDto })
  @IsOptional()
  photo?: FileDto | null;

  @ApiPropertyOptional({
    type: () => Role,
  })
  @IsOptional()
  role?: Role | null;

  @ApiPropertyOptional({ type: Date })
  @IsOptional()
  dob?: Date | null;

  @ApiPropertyOptional({
    enum: StatusEnum,
  })
  @IsEnum(StatusEnum)
  @IsOptional()
  status?: StatusEnum;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  hash?: string | null;
}
