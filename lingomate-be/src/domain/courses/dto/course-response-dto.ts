import { StatusEnum } from "@/common/enums/status.enum";
import { Category } from "@/domain/categories/domain/category";
import { FileDto } from "@/files/dto/file.dto";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional } from "class-validator";

export class CourseResponseDto {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({ example: "John Doe", type: String })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  price: number;

  @ApiProperty({ type: String })
  @IsOptional()
  description?: string | null;

  @ApiPropertyOptional({ type: () => FileDto })
  @IsOptional()
  photo?: FileDto | null;

  @ApiPropertyOptional({
    enum: StatusEnum,
  })
  @IsEnum(StatusEnum)
  @IsOptional()
  status?: StatusEnum;

  @ApiProperty({
    type: Category,
  })
  category: Category;

  @ApiProperty({ type: Date })
  createAt?: Date;

  @ApiProperty({ type: Date })
  updateAt?: Date;
}
