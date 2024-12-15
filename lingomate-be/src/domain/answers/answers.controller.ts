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
  InternalServerErrorException,
  NotFoundException,
  Req,
} from "@nestjs/common";
import { AnswersService } from "./answers.service";
import { CreateAnswerDto } from "./dto/create-answer.dto";
import { UpdateAnswerDto } from "./dto/update-answer.dto";
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { Answer } from "./domain/answer";
import { AuthGuard } from "@nestjs/passport";
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from "@/utils/dto/infinity-pagination-response.dto";
import { infinityPagination } from "@/utils/infinity-pagination";
import { FindAllAnswersDto } from "./dto/find-all-answers.dto";
import { RolesGuard } from "../auth/guards/roles.guard";
import { RoleEnum } from "../../common/enums/roles.enum";
import { Roles } from "../../utils/decorators/roles.decorator";
import { FileInterceptor } from "@nestjs/platform-express";
import { multerConfig } from "@/utils/interceptors/multerConfig.interceptor";
import { PermissionGuard } from "@/guards/permission.guard";
import { Permissions } from "@/utils/decorators/permission.decorator";
import { PermissionEnum } from "@/common/enums/permissions.enum";

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
  ) {
    const userId = req.user.id;
    return this.answersService.update(userId, id, updateAnswerDto);
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
