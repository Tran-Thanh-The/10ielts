import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateCourseDto {
  @ApiProperty({ example: "John Doe", type: String })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  price: number;

  @ApiProperty({ type: String })
  @IsOptional()
  description?: string | null;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  category_id: string;
}
