import { StatusEnum } from "@/common/enums/status.enum";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUserLessonDto {
  @ApiProperty({
    type: () => Number,
  })
  @IsNotEmpty()
  @IsString()
  user_id: number;

  @ApiProperty({
    type: () => String,
  })
  @IsNotEmpty()
  @IsString()
  lesson_id: string;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  isCompleted?: boolean | null;

  @ApiPropertyOptional({
    enum: StatusEnum,
  })
  @IsEnum(StatusEnum)
  @IsOptional()
  status?: StatusEnum;
}
