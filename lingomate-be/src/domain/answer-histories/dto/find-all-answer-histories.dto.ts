import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

export class PaginationOptionsDto {
  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  limit?: number;
}

export class FindAllAnswerHistoriesDto {
  @ApiPropertyOptional()
  @IsOptional()
  practiceId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  lessonId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  userId?: string;
}
