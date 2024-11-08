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
  NotFoundException,
  InternalServerErrorException,
  UseInterceptors,
} from "@nestjs/common";
import { PracticeExercisesService } from "./practice-exercises.service";
import { CreatePracticeExerciseDto } from "./dto/create-practice-exercise.dto";
import { UpdatePracticeExerciseDto } from "./dto/update-practice-exercise.dto";
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { PracticeExercise } from "./domain/practice-exercise";
import { AuthGuard } from "@nestjs/passport";
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from "@/utils/dto/infinity-pagination-response.dto";
import { infinityPagination } from "@/utils/infinity-pagination";
import { FindAllPracticeExercisesDto } from "./dto/find-all-practice-exercises.dto";
import { RolesGuard } from "../roles/roles.guard";
import { Roles } from "../roles/roles.decorator";
import { RoleEnum } from "../roles/roles.enum";
import { FileInterceptor } from "@nestjs/platform-express";
import { multerConfig } from "@/utils/interceptors/multerConfig.interceptor";

@ApiTags("Practiceexercises")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Controller({
  path: "practice-exercises",
  version: "1",
})
export class PracticeExercisesController {
  constructor(
    private readonly practiceExercisesService: PracticeExercisesService,
  ) {}

  @Roles(RoleEnum.admin, RoleEnum.staff)
  @Post()
  @UseInterceptors(FileInterceptor("file", multerConfig))
  @ApiConsumes("multipart/form-data")
  @ApiCreatedResponse({
    type: PracticeExercise,
  })
  async create(
    @Body() createPracticeExerciseDto: CreatePracticeExerciseDto,
    @Req() req,
  ) {
    try {
      const userId = req.user.id;
      return await this.practiceExercisesService.create(
        userId,
        createPracticeExerciseDto,
      );
    } catch (error) {
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
    type: InfinityPaginationResponse(PracticeExercise),
  })
  async findAll(
    @Query() query: FindAllPracticeExercisesDto,
  ): Promise<InfinityPaginationResponseDto<PracticeExercise>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.practiceExercisesService.findAllWithPagination({
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
    type: PracticeExercise,
  })
  findOne(@Param("id") id: string) {
    return this.practiceExercisesService.findOne(id);
  }

  @Roles(RoleEnum.admin, RoleEnum.staff)
  @Patch(":id")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: PracticeExercise,
  })
  update(
    @Param("id") id: string,
    @Body() updatePracticeExerciseDto: UpdatePracticeExerciseDto,
  ) {
    return this.practiceExercisesService.update(id, updatePracticeExerciseDto);
  }

  @Roles(RoleEnum.admin, RoleEnum.staff)
  @Delete(":id")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  remove(@Param("id") id: string) {
    return this.practiceExercisesService.remove(id);
  }
}
