import { DifficultyEnum, PracticeTypeEnum } from "@/common/enums/practice.enum";
import { StatusEnum } from "@/common/enums/status.enum";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class CreatePracticeExerciseDto {
  // Don't forget to use the class-validator decorators in the DTO properties.
  @ApiProperty({
    type: () => Number,
  })
  @IsNotEmpty()
  user_id: number;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  description: string;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  content: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  price: number;

  @ApiProperty({
    enum: PracticeTypeEnum,
  })
  @IsNotEmpty()
  @IsEnum(PracticeTypeEnum)
  practiceType: PracticeTypeEnum;

  @ApiProperty({
    enum: DifficultyEnum,
  })
  @IsNotEmpty()
  @IsEnum(DifficultyEnum)
  difficulty: DifficultyEnum;

  @ApiPropertyOptional({
    enum: StatusEnum,
  })
  @IsEnum(StatusEnum)
  @IsOptional()
  status?: StatusEnum;
}
