import { StatusEnum } from "@/common/enums/status.enum";
import { CourseEntity } from "@/domain/courses/infrastructure/persistence/relational/entities/course.entity";
import { UserEntity } from "@/domain/users/infrastructure/persistence/relational/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

export class UserCourse {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: () => UserEntity,
  })
  user: UserEntity;

  @ApiProperty({
    type: () => CourseEntity,
  })
  course: CourseEntity;

  @ApiProperty({
    type: () => String,
  })
  currentLesson?: string;

  @ApiProperty({ type: Number })
  lastPosition?: number | null;

  @ApiProperty({
    enum: StatusEnum,
  })
  status: StatusEnum;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
