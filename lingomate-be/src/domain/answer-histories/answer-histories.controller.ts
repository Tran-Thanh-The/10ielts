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
} from "@nestjs/common";
import { AnswerHistoriesService } from "./answer-histories.service";
import { CreateAnswerHistoryDto } from "./dto/create-answer-history.dto";
import { UpdateAnswerHistoryDto } from "./dto/update-answer-history.dto";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { AnswerHistory } from "./domain/answer-history";
import { AuthGuard } from "@nestjs/passport";
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from "@/utils/dto/infinity-pagination-response.dto";
import { infinityPagination } from "@/utils/infinity-pagination";
import { FindAllAnswerHistoriesDto } from "./dto/find-all-answer-histories.dto";
import { RolesGuard } from "../roles/roles.guard";
import { RoleEnum } from "../roles/roles.enum";
import { Roles } from "../roles/roles.decorator";

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
  @ApiCreatedResponse({
    type: AnswerHistory,
  })
  create(@Body() createAnswerHistoryDto: CreateAnswerHistoryDto) {
    return this.answerHistoriesService.create(createAnswerHistoryDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(AnswerHistory),
  })
  async findAll(
    @Query() query: FindAllAnswerHistoriesDto,
  ): Promise<InfinityPaginationResponseDto<AnswerHistory>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.answerHistoriesService.findAllWithPagination({
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
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
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: AnswerHistory,
  })
  update(
    @Param("id") id: string,
    @Body() updateAnswerHistoryDto: UpdateAnswerHistoryDto,
  ) {
    return this.answerHistoriesService.update(id, updateAnswerHistoryDto);
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
