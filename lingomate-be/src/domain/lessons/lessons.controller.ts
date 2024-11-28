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
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  UseInterceptors,
  UploadedFile,
  Req,
} from "@nestjs/common";
import { LessonsService } from "./lessons.service";
import { CreateLessonDto } from "./dto/create-lesson.dto";
import { UpdateLessonDto } from "./dto/update-lesson.dto";
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import { Lesson } from "./domain/lesson";
import { AuthGuard } from "@nestjs/passport";
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from "@/utils/dto/infinity-pagination-response.dto";
import { infinityPagination } from "@/utils/infinity-pagination";
import { FindAllLessonsDto } from "./dto/find-all-lessons.dto";
import { RolesGuard } from "../roles/roles.guard";
import { RoleEnum } from "../roles/roles.enum";
import { Roles } from "../roles/roles.decorator";
import { FileInterceptor } from "@nestjs/platform-express";
import { multerConfig } from "@/utils/interceptors/multerConfig.interceptor";
import { NullableType } from "@/utils/types/nullable.type";
import { StatusEnum } from "@/common/enums/status.enum";
import { PermissionGuard } from "@/guards/permission.guard";
import { Permissions } from "@/utils/decorators/permission.decorator";
import { PermissionEnum } from "@/common/enums/permissions.enum";

@ApiTags("Lessons")
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), PermissionGuard)
@Controller({
  path: "lessons",
  version: "1",
})
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Post(":courseId")
  @Permissions(PermissionEnum.CREATE_LESSON)
  @UseInterceptors(FileInterceptor("file", multerConfig))
  @ApiConsumes("multipart/form-data")
  @ApiCreatedResponse({
    type: Lesson,
  })
  async create(
    @Param("courseId") courseId: string,
    @Body() createLessonDto: CreateLessonDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ) {
    try {
      const userId = req.user.id;
      return await this.lessonsService.create(
        userId,
        courseId,
        createLessonDto,
        file,
      );
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException("Conflict title");
      }
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        "An error occurred while creating the lesson. Please try again later.",
      );
    }
  }

  @Get()
  @Permissions(PermissionEnum.READ_LESSON)
  @ApiOkResponse({
    type: InfinityPaginationResponse(Lesson),
  })
  async findAll(
    @Query() query: FindAllLessonsDto,
  ): Promise<InfinityPaginationResponseDto<Lesson>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }
    return infinityPagination(
      await this.lessonsService.findAllWithPagination({
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @Get("course/:courseId")
  @Permissions(PermissionEnum.READ_LESSON)
  @ApiParam({
    name: "courseId",
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: InfinityPaginationResponse(Lesson),
  })
  async findAllByCourse(
    @Param("courseId") courseId: string,
    @Query() query: FindAllLessonsDto,
  ): Promise<InfinityPaginationResponseDto<Lesson>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }
    return infinityPagination(
      await this.lessonsService.findAllWithPaginationAndCourseId({
        courseId,
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @Get(":id/detail")
  @Permissions(PermissionEnum.READ_LESSON)
  @ApiQuery({
    name: "order",
    required: false,
    enum: ["ASC", "DESC"],
    description: "Order of questions by position (ASC or DESC)",
  })
  @ApiQuery({
    name: "status",
    required: false,
    enum: StatusEnum,
    description: "Status filter for questions",
  })
  async getDetail(
    @Param("id") id: string,
    @Query("page") page = 1,
    @Query("limit") limit = 10,
    @Query("order") order: "ASC" | "DESC" = "ASC",
    @Query("status") status?: StatusEnum,
  ): Promise<NullableType<Lesson>> {
    if (limit > 50) {
      limit = 50;
    }
    return this.lessonsService.getLessonDetail(id, {
      page,
      limit,
      order,
      status,
    });
  }

  @Get(":id")
  @Permissions(PermissionEnum.READ_LESSON)
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Lesson,
  })
  findOne(@Param("id") id: string) {
    return this.lessonsService.findById(id);
  }


  @Patch(":id")
  @Permissions(PermissionEnum.UPDATE_LESSON)
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Lesson,
  })
  async update(
    @Param("id") id: string,
    @Body() updateLessonDto: UpdateLessonDto,
  ) {
    try {
      return await this.lessonsService.update(id, updateLessonDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      }
      throw new InternalServerErrorException(
        "An error occurred while updating the lesson. Please try again later.",
      );
    }
  }

  @Delete(":id")
  @Permissions(PermissionEnum.DELETE_LESSON)
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  remove(@Param("id") id: string) {
    return this.lessonsService.remove(id);
  }
}
