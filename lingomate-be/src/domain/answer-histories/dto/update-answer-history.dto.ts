// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { CreateAnswerHistoryDto } from "./create-answer-history.dto";
import { FileDto } from "@/files/dto/file.dto";
import { IsOptional } from "class-validator";

export class UpdateAnswerHistoryDto extends PartialType(
  CreateAnswerHistoryDto,
) {
  @ApiProperty({
      type: "string",
      format: "binary",
      required: false,
      description: "Speaking audio file",
    })
    fileUpload?: Express.Multer.File;
  
    @ApiPropertyOptional({ type: () => FileDto })
    @IsOptional()
    audioAnswer?: FileDto | null;
}
