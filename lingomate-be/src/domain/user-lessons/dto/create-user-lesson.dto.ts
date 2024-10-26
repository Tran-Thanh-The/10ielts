import { StatusEnum } from "@/common/enums/status.enum";
import { CreateLessonDto } from "@/domain/lessons/dto/create-lesson.dto";
import { CreateUserDto } from "@/domain/users/dto/create-user.dto";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreateUserLessonDto {
  // Don't forget to use the class-validator decorators in the DTO properties.
  @ApiProperty({
    type: () => CreateUserDto,
  })
  @IsNotEmpty()
  user: CreateUserDto;

  @ApiProperty({
    type: () => CreateLessonDto,
  })
  @IsNotEmpty()
  lesson: CreateLessonDto;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber()
  point?: number | null;

  @ApiProperty({
    enum: StatusEnum,
  })
  @IsEnum(StatusEnum)
  status: StatusEnum;
}
