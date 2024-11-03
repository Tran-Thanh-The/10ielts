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

@ApiTags("Lessons")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Controller({
  path: "lessons",
  version: "1",
})
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Roles(RoleEnum.admin, RoleEnum.staff)
  @Post(":courseId")
  @UseInterceptors(FileInterceptor("file", multerConfig))
  @ApiConsumes("multipart/form-data")
  @ApiCreatedResponse({
    type: Lesson,
  })
  async create(
    @Param("courseId") courseId: string,
    @Body() createLessonDto: CreateLessonDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      return await this.lessonsService.create(courseId, createLessonDto, file);
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

  @Roles(RoleEnum.admin, RoleEnum.staff, RoleEnum.user)
  @Get()
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

  @Roles(RoleEnum.admin, RoleEnum.staff, RoleEnum.user)
  @Get(":id")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Lesson,
  })
  findOne(@Param("id") id: string) {
    return this.lessonsService.findOne(id);
  }

  @Roles(RoleEnum.admin, RoleEnum.staff)
  @Patch(":id")
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

  @Roles(RoleEnum.admin, RoleEnum.staff)
  @Delete(":id")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  remove(@Param("id") id: string) {
    return this.lessonsService.remove(id);
  }
}
