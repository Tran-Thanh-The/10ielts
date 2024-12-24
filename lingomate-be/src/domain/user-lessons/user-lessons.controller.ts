import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
} from "@nestjs/common";
import { UserLessonsService } from "./user-lessons.service";
import { CreateUserLessonDto } from "./dto/create-user-lesson.dto";
import { UpdateUserLessonDto } from "./dto/update-user-lesson.dto";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { UserLesson } from "./domain/user-lesson";
import { AuthGuard } from "@nestjs/passport";
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from "@/utils/dto/infinity-pagination-response.dto";
import { infinityPagination } from "@/utils/infinity-pagination";
import { FindAllUserLessonsDto } from "./dto/find-all-user-lessons.dto";
import { NullableType } from "@/utils/types/nullable.type";

@ApiTags("Userlessons")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller({
  path: "user-lessons",
  version: "1",
})
export class UserLessonsController {
  constructor(private readonly userLessonsService: UserLessonsService) {}

  @Post()
  @ApiCreatedResponse({
    type: UserLesson,
  })
  create(@Body() createUserLessonDto: CreateUserLessonDto) {
    return this.userLessonsService.create(createUserLessonDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(UserLesson),
  })
  async findAll(
    @Query() query: FindAllUserLessonsDto,
  ): Promise<InfinityPaginationResponseDto<UserLesson>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.userLessonsService.findAllWithPagination({
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @Get(":userId")
  @ApiOkResponse({
    type: InfinityPaginationResponse(UserLesson),
  })
  async findAllByUserId(
    @Query() query: FindAllUserLessonsDto,
    @Req() req,
  ): Promise<NullableType<UserLesson[]>> {
    const userId = req.user.id;
    return this.userLessonsService.findAllByUserId(userId);
  }

  @Get(":id")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: UserLesson,
  })
  findOne(@Param("id") id: string) {
    return this.userLessonsService.findOne(id);
  }

  @Patch(":id")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: UserLesson,
  })
  update(
    @Param("id") id: string,
    @Body() updateUserLessonDto: UpdateUserLessonDto,
  ) {
    return this.userLessonsService.update(id, updateUserLessonDto);
  }

  @Delete(":id")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  remove(@Param("id") id: string) {
    return this.userLessonsService.remove(id);
  }
}
