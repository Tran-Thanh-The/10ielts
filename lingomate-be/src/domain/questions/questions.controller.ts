import { PermissionEnum } from "@/common/enums/permissions.enum";
import { PermissionGuard } from "@/guards/permission.guard";
import { Permissions } from "@/utils/decorators/permission.decorator";
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from "@/utils/dto/infinity-pagination-response.dto";
import { infinityPagination } from "@/utils/infinity-pagination";
import { multerConfig } from "@/utils/interceptors/multerConfig.interceptor";
import {
  Body,
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
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { Question } from "./domain/question";
import { CreateQuestionDto } from "./dto/create-question.dto";
import { FindAllQuestionsDto } from "./dto/find-all-questions.dto";
import { UpdateQuestionDto } from "./dto/update-question.dto";
import { QuestionsService } from "./questions.service";

@ApiTags("Questions")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"), PermissionGuard)
@Controller({
  path: "questions",
  version: "1",
})
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  @Permissions(PermissionEnum.CREATE_QUESTION)
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

  @Get()
  @Permissions(PermissionEnum.READ_QUESTION)
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

  @Get(":id")
  @Permissions(PermissionEnum.READ_QUESTION)
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

  @Patch(":id")
  @Permissions(PermissionEnum.UPDATE_QUESTION)
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Question,
  })
  update(
    @Req() req,
    @Param("id") id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    const userId = req.user.id;
    return this.questionsService.update(userId, id, updateQuestionDto);
  }

  @Delete(":id")
  @Permissions(PermissionEnum.DELETE_QUESTION)
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  remove(@Param("id") id: string) {
    return this.questionsService.remove(id);
  }
}
