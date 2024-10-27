import { StatusEnum } from "@/common/enums/status.enum";
import { Course } from "@/domain/courses/domain/course";
import { User } from "@/domain/users/domain/user";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional } from "class-validator";

export class UserCourseResponseDto {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: () => User,
  })
  @IsNotEmpty()
  user: User;

  @ApiProperty({
    type: () => Course,
  })
  @IsNotEmpty()
  course: Course;

  @ApiPropertyOptional({
    type: () => String,
  })
  @IsOptional()
  currentLesson?: string | null;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  lastPosition?: number | null;

  @ApiPropertyOptional({
    enum: StatusEnum,
  })
  @IsEnum(StatusEnum)
  @IsOptional()
  status?: StatusEnum;

  @ApiProperty({ type: Date })
  createdAt?: Date;

  @ApiProperty({ type: Date })
  updatedAt?: Date;
}
