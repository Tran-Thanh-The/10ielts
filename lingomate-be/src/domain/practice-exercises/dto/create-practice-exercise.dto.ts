import {
  IsNumber, // decorators here
} from "class-validator";

import {
  ApiProperty, // decorators here
} from "@nestjs/swagger";

export class CreatePracticeExerciseDto {
  @ApiProperty()
  @IsNumber()
  price: number;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
