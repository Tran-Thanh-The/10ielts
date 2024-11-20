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
import { UserAnswersService } from "./user-answers.service";
import { CreateUserAnswerDto } from "./dto/create-user-answer.dto";
import { UpdateUserAnswerDto } from "./dto/update-user-answer.dto";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { UserAnswer } from "./domain/user-answer";
import { AuthGuard } from "@nestjs/passport";
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from "@/utils/dto/infinity-pagination-response.dto";
import { infinityPagination } from "@/utils/infinity-pagination";
import { FindAllUserAnswersDto } from "./dto/find-all-user-answers.dto";

@ApiTags("Useranswers")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller({
  path: "user-answers",
  version: "1",
})
export class UserAnswersController {
  constructor(private readonly userAnswersService: UserAnswersService) {}

  @Post()
  @ApiCreatedResponse({
    type: UserAnswer,
  })
  create(@Body() createUserAnswerDto: CreateUserAnswerDto) {
    return this.userAnswersService.create(createUserAnswerDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(UserAnswer),
  })
  async findAll(
    @Query() query: FindAllUserAnswersDto,
  ): Promise<InfinityPaginationResponseDto<UserAnswer>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.userAnswersService.findAllWithPagination({
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
    type: UserAnswer,
  })
  findOne(@Param("id") id: string) {
    return this.userAnswersService.findOne(id);
  }

  @Patch(":id")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: UserAnswer,
  })
  update(
    @Param("id") id: string,
    @Body() updateUserAnswerDto: UpdateUserAnswerDto,
  ) {
    return this.userAnswersService.update(id, updateUserAnswerDto);
  }

  @Delete(":id")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  remove(@Param("id") id: string) {
    return this.userAnswersService.remove(id);
  }
}
