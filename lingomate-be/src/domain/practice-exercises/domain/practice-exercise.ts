import { ApiProperty } from "@nestjs/swagger";

export class PracticeExercise {
  @ApiProperty()
  price: number;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
