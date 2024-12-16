// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { CreateCourseDto } from "./create-course.dto";
import { FileDto } from "@/files/dto/file.dto";
import { IsOptional } from "class-validator";

export class UpdateCourseDto extends PartialType(CreateCourseDto) {
    @ApiProperty({
        type: 'string',
        format: 'binary',
        required: false,
        description: 'Course photo file'
      })
    file?: Express.Multer.File;
    
    @ApiPropertyOptional({ type: () => FileDto })
    @IsOptional()
    photo?: FileDto | null;
}
