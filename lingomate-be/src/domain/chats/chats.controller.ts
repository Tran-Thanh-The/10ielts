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
  UploadedFile,
  Req,
  UseInterceptors,
} from "@nestjs/common";
import { ChatsService } from "./chats.service";
import { CreateChatDto } from "./dto/create-chat.dto";
import { UpdateChatDto } from "./dto/update-chat.dto";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { Chat } from "./domain/chat";
import { AuthGuard } from "@nestjs/passport";
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from "@/utils/dto/infinity-pagination-response.dto";
import { infinityPagination } from "@/utils/infinity-pagination";
import { FindAllChatsDto } from "./dto/find-all-chats.dto";
import { Request } from "express";
import { FileInterceptor } from "@nestjs/platform-express";
import { multerConfig } from "@/utils/interceptors/multerConfig.interceptor";

@ApiTags("Chats")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller({
  path: "chats",
  version: "1",
})
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Post("/send-message")
  @ApiCreatedResponse({
    type: Chat,
  })
  @UseInterceptors(FileInterceptor("file", multerConfig))
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        message: {
          type: "string",
        },
        chatId: {
          type: "string",
        },
        file: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  async sendMessage(
    @Body() body: CreateChatDto,
    @Req() req: Request,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      const newMessage = await this.chatsService.create(body, req, file);
      return newMessage;
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Chat),
  })
  async findAll(
    @Query() query: FindAllChatsDto,
  ): Promise<InfinityPaginationResponseDto<Chat>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.chatsService.findAllWithPagination({
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
    type: Chat,
  })
  findOne(@Param("id") id: string) {
    return this.chatsService.findOne(id);
  }

  @Patch(":id")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Chat,
  })
  update(@Param("id") id: string, @Body() updateChatDto: UpdateChatDto) {
    return this.chatsService.update(id, updateChatDto);
  }

  @Delete(":id")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  remove(@Param("id") id: string) {
    return this.chatsService.remove(id);
  }
}
