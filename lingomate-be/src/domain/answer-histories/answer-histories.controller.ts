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
import { AnswerHistoriesService } from "./answer-histories.service";
import { AnswerHistory } from "./domain/answer-history";
import { CreateAnswerHistoryDto } from "./dto/create-answer-history.dto";
import {
  FindAllAnswerHistoriesDto,
  PaginationOptionsDto,
} from "./dto/find-all-answer-histories.dto";
import { UpdateAnswerHistoryDto } from "./dto/update-answer-history.dto";

@ApiTags("Answerhistories")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller({
  path: "answer-histories",
  version: "1",
})
export class AnswerHistoriesController {
  constructor(
    private readonly answerHistoriesService: AnswerHistoriesService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor("audioAnswer", multerConfig))
  @ApiConsumes("multipart/form-data")
  @ApiCreatedResponse({
    type: AnswerHistory,
  })
  async create(
    @Body() createAnswerHistoryDto: CreateAnswerHistoryDto,
    @Req() req,
    @UploadedFile() audioAnswer: Express.Multer.File,
  ) {
    // try {
    const userId = req.user.id;
    return await this.answerHistoriesService.create(
      userId,
      createAnswerHistoryDto,
      audioAnswer,
    );
    // } catch (error) {
    //    if (error instanceof NotFoundException) {
    //       throw error;
    //     }
    //     throw new InternalServerErrorException(
    //       "An error occurred while creating the answer-history. Please try again later.",
    //     );
    // }
  }

  // @Get()
  // @ApiOkResponse({
  //   type: InfinityPaginationResponse(AnswerHistory),
  // })
  // async findAll(
  //   @Query() query: FindAllAnswerHistoriesDto,
  // ): Promise<InfinityPaginationResponseDto<AnswerHistory>> {
  //   const page = query?.page ?? 1;
  //   let limit = query?.limit ?? 10;
  //   if (limit > 50) {
  //     limit = 50;
  //   }

  //   return infinityPagination(
  //     await this.answerHistoriesService.findAllWithPagination({
  //       paginationOptions: {
  //         page,
  //         limit,
  //       },
  //     }),
  //     { page, limit },
  //   );
  // }
  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(AnswerHistory),
  })
  async findAll(
    @Query() query: FindAllAnswerHistoriesDto,
    @Query() pagination: PaginationOptionsDto,
  ): Promise<InfinityPaginationResponseDto<AnswerHistory>> {
    const page = pagination?.page ?? 1;
    let limit = pagination?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    const answerHistories =
      await this.answerHistoriesService.findAllWithPagination({
        paginationOptions: { page, limit },
        practiceId: query.practiceId,
        lessonId: query.lessonId,
        courseId: query.courseId,
        userId: query.userId,
      });

    return infinityPagination(answerHistories, { page, limit });
  }

  @Get(":id")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: AnswerHistory,
  })
  findOne(@Param("id") id: string) {
    return this.answerHistoriesService.findOne(id);
  }

  @Patch(":id")
  @UseInterceptors(FileInterceptor("file", multerConfig))
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: AnswerHistory,
  })
  async update(
    @Param("id") id: string,
    @Body() updateAnswerHistoryDto: UpdateAnswerHistoryDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      return await this.answerHistoriesService.update(
        id,
        updateAnswerHistoryDto,
        file,
      );
    } catch (error) {
      throw new InternalServerErrorException(
        "An error occurred while updating the answer-history. Please try again later.",
      );
    }
  }

  @Delete(":id")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  remove(@Param("id") id: string) {
    return this.answerHistoriesService.remove(id);
  }
}
