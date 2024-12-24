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
import { AnswersService } from "./answers.service";
import { Answer } from "./domain/answer";
import { CreateAnswerDto } from "./dto/create-answer.dto";
import { FindAllAnswersDto } from "./dto/find-all-answers.dto";
import { UpdateAnswerDto } from "./dto/update-answer.dto";

@ApiTags("Answers")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"), PermissionGuard)
@Controller({
  path: "answers",
  version: "1",
})
export class AnswersController {
  constructor(private readonly answersService: AnswersService) {}

  @Post(":questionId")
  @Permissions(PermissionEnum.CREATE_ANSWER)
  @UseInterceptors(FileInterceptor("file", multerConfig))
  @ApiConsumes("multipart/form-data")
  @ApiCreatedResponse({
    type: Answer,
  })
  async create(
    @Req() req,
    @Param("questionId") questionId: string,
    @Body() createAnswerDto: CreateAnswerDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const userId = req.user.id;
      return await this.answersService.create(
        userId,
        questionId,
        createAnswerDto,
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
  @Permissions(PermissionEnum.READ_ANSWER)
  @ApiOkResponse({
    type: InfinityPaginationResponse(Answer),
  })
  async findAll(
    @Query() query: FindAllAnswersDto,
  ): Promise<InfinityPaginationResponseDto<Answer>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.answersService.findAllWithPagination({
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @Get(":id")
  @Permissions(PermissionEnum.READ_ANSWER)
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Answer,
  })
  findOne(@Param("id") id: string) {
    return this.answersService.findOne(id);
  }

  @Patch(":id")
  @Permissions(PermissionEnum.UPDATE_ANSWER)
  @UseInterceptors(FileInterceptor("file", multerConfig))
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Answer,
  })
  update(
    @Req() req,
    @Param("id") id: string,
    @Body() updateAnswerDto: UpdateAnswerDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const userId = req.user.id;
    return this.answersService.update(userId, id, updateAnswerDto, file);
  }

  @Delete(":id")
  @Permissions(PermissionEnum.DELETE_ANSWER)
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  remove(@Param("id") id: string) {
    return this.answersService.remove(id);
  }
}
