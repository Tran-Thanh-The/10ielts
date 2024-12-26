import { PermissionEnum } from "@/common/enums/permissions.enum";
import { PermissionGuard } from "@/guards/permission.guard";
import { Permissions } from "@/utils/decorators/permission.decorator";
import { multerConfig } from "@/utils/interceptors/multerConfig.interceptor";
import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { CoursesService } from "./courses.service";
import { Course } from "./domain/course";
import { CourseWithDetailsDTO } from "./dto/course-details-dto";
import { CourseQueryDto, parseOrderBy } from "./dto/course-query-dto";
import { CourseListResponseDto } from "./dto/courses-response-dto";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";

@ApiTags("Courses")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"), PermissionGuard)
@Controller({
  path: "courses",
  version: "1",
})
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @Permissions(PermissionEnum.CREATE_COURSE)
  @UseInterceptors(FileInterceptor("file", multerConfig))
  @ApiConsumes("multipart/form-data")
  @ApiCreatedResponse({
    type: Course,
  })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
        name: { type: "string" },
        price: { type: "number" },
        description: { type: "string" },
        category_id: { type: "string" },
      },
    },
  })
  create(
    @Body() createCourseDto: CreateCourseDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ) {
    try {
      const userId = req.user.id;
      return this.coursesService.create(createCourseDto, userId, file);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      }
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        "An error occurred while updating the lesson. Please try again later.",
      );
    }
  }

  @Get("/list")
  @Permissions(PermissionEnum.READ_COURSE)
  @ApiOperation({ summary: "Get list of courses with filters and pagination" })
  @ApiResponse({
    status: 200,
    description: "List of courses retrieved successfully",
    type: CourseListResponseDto,
  })
  async getListCourse(
    @Query() query: CourseQueryDto,
  ): Promise<CourseListResponseDto<CourseWithDetailsDTO>> {
    const orderBy = parseOrderBy(query.orderBy);
    return this.coursesService.getListCourse(
      query.status,
      query.userId,
      query.invoiceId,
      query.categoryId,
      query.page,
      query.limit,
      query.search,
      query.isMyCourse,
      orderBy,
    );
  }

  @Get(":id")
  @Permissions(PermissionEnum.READ_COURSE)
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Course,
  })
  findOne(@Param("id") id: string) {
    return this.coursesService.findOne(id);
  }

  @Get(":id/details")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Course,
  })
  getCourseWithDetails(@Param("id") id: string, @Req() req) {
    const userId = req.user.id;
    return this.coursesService.getCourseDetails(id, userId);
  }

  @Patch(":id")
  @Permissions(PermissionEnum.UPDATE_COURSE)
  @UseInterceptors(FileInterceptor("file", multerConfig))
  @ApiConsumes("multipart/form-data")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Course,
  })
  update(
    @Param("id") id: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      return this.coursesService.update(id, updateCourseDto, file);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        "An error occurred while updating the course. Please try again later.",
      );
    }
  }

  @Delete(":id")
  @Permissions(PermissionEnum.DELETE_COURSE)
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  async remove(@Param("id") id: string) {
    try {
      return await this.coursesService.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        "An error occurred while creating the lesson. Please try again later.",
      );
    }
  }
}
