import {
  Controller,
  Post,
  Body,
  UseGuards,
  UploadedFile,
  Req,
  UseInterceptors,
} from "@nestjs/common";
import { ChatsService } from "./chats.service";
import { CreateChatDto } from "./dto/create-chat.dto";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Chat } from "./domain/chat";
import { AuthGuard } from "@nestjs/passport";
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
        conversationId: {
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
}
