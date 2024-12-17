// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { CreateLessonDto } from "./create-lesson.dto";
import { FileDto } from "@/files/dto/file.dto";
import { IsOptional } from "class-validator";

export class UpdateLessonDto extends PartialType(CreateLessonDto) {
    @ApiProperty({
        type: 'string',
        format: 'binary',
        required: false,
        description: 'Lesson photo file'
        })
    fileUpload?: Express.Multer.File;

    @ApiPropertyOptional({ type: () => FileDto })
    @IsOptional()
    file?: FileDto | null;
}
