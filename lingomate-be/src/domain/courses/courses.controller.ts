import { RoleEnum } from "@/domain/roles/roles.enum";
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
import { Roles } from "../roles/roles.decorator";
import { RolesGuard } from "../roles/roles.guard";
import { CoursesService } from "./courses.service";
import { Course } from "./domain/course";
import { CourseQueryDto, parseOrderBy } from "./dto/course-query-dto";
import { CourseResponseDto } from "./dto/course-response-dto";
import { CourseListResponseDto } from "./dto/courses-response-dto";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";
import { multerConfig } from "@/utils/interceptors/multerConfig.interceptor";

@ApiTags("Courses")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Controller({
  path: "courses",
  version: "1",
})
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Roles(RoleEnum.admin, RoleEnum.staff)
  @Post()
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

  @Roles(RoleEnum.admin, RoleEnum.staff, RoleEnum.user)
  @Get("/list")
  @ApiOperation({ summary: "Get list of courses with filters and pagination" })
  @ApiResponse({
    status: 200,
    description: "List of courses retrieved successfully",
    type: CourseListResponseDto,
  })
  async getListCourse(
    @Query() query: CourseQueryDto,
  ): Promise<CourseListResponseDto<CourseResponseDto>> {
    const orderBy = parseOrderBy(query.orderBy);

    return this.coursesService.getListCourse(
      query.status,
      query.userId,
      query.invoiceId,
      query.page,
      query.limit,
      orderBy,
    );
  }

  // @Roles(RoleEnum.admin, RoleEnum.staff, RoleEnum.user)
  // @Get()
  // @ApiOkResponse({
  //   type: InfinityPaginationResponse(Course),
  // })
  // async findAll(
  //   @Query() query: FindAllCoursesDto,
  // ): Promise<InfinityPaginationResponseDto<Course>> {
  //   const page = query?.page ?? 1;
  //   let limit = query?.limit ?? 10;
  //   if (limit > 50) {
  //     limit = 50;
  //   }

  //   return infinityPagination(
  //     await this.coursesService.findAllWithPagination({
  //       paginationOptions: {
  //         page,
  //         limit,
  //       },
  //     }),
  //     { page, limit },
  //   );
  // }

  @Roles(RoleEnum.admin, RoleEnum.staff, RoleEnum.user)
  @Get(":id")
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

  @Roles(RoleEnum.admin, RoleEnum.staff, RoleEnum.user)
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

  @Roles(RoleEnum.admin, RoleEnum.staff)
  @Patch(":id")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Course,
  })
  update(@Param("id") id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.coursesService.update(id, updateCourseDto);
  }

  @Roles(RoleEnum.admin, RoleEnum.staff)
  @Delete(":id")
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
