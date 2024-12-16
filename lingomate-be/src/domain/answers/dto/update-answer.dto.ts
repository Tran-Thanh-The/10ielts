// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { CreateAnswerDto } from "./create-answer.dto";
import { IsOptional } from "class-validator";
import { FileDto } from "@/files/dto/file.dto";

export class UpdateAnswerDto extends PartialType(CreateAnswerDto) {
     @ApiProperty({
        type: 'string',
        format: 'binary',
        required: false,
        description: 'Answer photo file'
        })
    fileUpload?: Express.Multer.File;
    
    @ApiPropertyOptional({ type: () => FileDto })
    @IsOptional()
    file?: FileDto | null;
}
