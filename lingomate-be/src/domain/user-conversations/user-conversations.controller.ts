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
import { UserConversationsService } from "./user-conversations.service";
import { CreateUserConversationDto } from "./dto/create-user-conversation.dto";
import { UpdateUserConversationDto } from "./dto/update-user-conversation.dto";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { UserConversation } from "./domain/user-conversation";
import { AuthGuard } from "@nestjs/passport";
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from "@/utils/dto/infinity-pagination-response.dto";
import { infinityPagination } from "@/utils/infinity-pagination";
import { FindAllUserConversationsDto } from "./dto/find-all-user-conversations.dto";

@ApiTags("Userconversations")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller({
  path: "user-conversations",
  version: "1",
})
export class UserConversationsController {
  constructor(
    private readonly userConversationsService: UserConversationsService,
  ) {}

  @Post()
  @ApiCreatedResponse({
    type: UserConversation,
  })
  create(@Body() createUserConversationDto: CreateUserConversationDto) {
    return this.userConversationsService.create(createUserConversationDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(UserConversation),
  })
  async findAll(
    @Query() query: FindAllUserConversationsDto,
  ): Promise<InfinityPaginationResponseDto<UserConversation>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.userConversationsService.findAllWithPagination({
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
    type: UserConversation,
  })
  findOne(@Param("id") id: string) {
    return this.userConversationsService.findOne(id);
  }

  @Patch(":id")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: UserConversation,
  })
  update(
    @Param("id") id: string,
    @Body() updateUserConversationDto: UpdateUserConversationDto,
  ) {
    return this.userConversationsService.update(id, updateUserConversationDto);
  }

  @Delete(":id")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  remove(@Param("id") id: string) {
    return this.userConversationsService.remove(id);
  }
}
