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
  UseInterceptors,
  UploadedFile,
  NotFoundException,
  InternalServerErrorException,
  Req,
} from "@nestjs/common";
import { QuestionsService } from "./questions.service";
import { CreateQuestionDto } from "./dto/create-question.dto";
import { UpdateQuestionDto } from "./dto/update-question.dto";
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { Question } from "./domain/question";
import { AuthGuard } from "@nestjs/passport";
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from "@/utils/dto/infinity-pagination-response.dto";
import { infinityPagination } from "@/utils/infinity-pagination";
import { FindAllQuestionsDto } from "./dto/find-all-questions.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { multerConfig } from "@/utils/interceptors/multerConfig.interceptor";
import { RolesGuard } from "../roles/roles.guard";
import { Roles } from "../roles/roles.decorator";
import { RoleEnum } from "../roles/roles.enum";

@ApiTags("Questions")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Controller({
  path: "questions",
  version: "1",
})
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Roles(RoleEnum.admin, RoleEnum.staff)
  @Post()
  @UseInterceptors(FileInterceptor("file", multerConfig))
  @ApiConsumes("multipart/form-data")
  @ApiCreatedResponse({
    type: Question,
  })
  async create(
    @Req() req,
    @Body() createQuestionDto: CreateQuestionDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const userId = req.user.id;
      return await this.questionsService.create(
        userId,
        createQuestionDto,
        file,
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
    type: InfinityPaginationResponse(Question),
  })
  async findAll(
    @Query() query: FindAllQuestionsDto,
  ): Promise<InfinityPaginationResponseDto<Question>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.questionsService.findAllWithPagination({
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
    type: Question,
  })
  findOne(@Param("id") id: string) {
    return this.questionsService.findOne(id);
  }

  @Roles(RoleEnum.admin, RoleEnum.staff)
  @Patch(":id")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Question,
  })
  update(
    @Param("id") id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return this.questionsService.update(id, updateQuestionDto);
  }

  @Roles(RoleEnum.admin, RoleEnum.staff)
  @Delete(":id")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  remove(@Param("id") id: string) {
    return this.questionsService.remove(id);
  }
}
