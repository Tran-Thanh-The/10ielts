import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Query,
  Req,
  Res,
  HttpStatus,
} from "@nestjs/common";
import { ConversationsService } from "./conversations.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { infinityPagination } from "@/utils/infinity-pagination";
import { FindAllConversationsDto } from "./dto/find-all-conversations.dto";
import { Roles } from "@/domain/roles/roles.decorator";
import { RoleEnum } from "@/domain/roles/roles.enum";
import { JwtAuthGuard } from "@/domain/auth/guards/jwt.guard";
import { Public } from "@/utils/decorators/public.decorator";
import { Request, Response } from "express";
import { FindAllMessageOfConversationRequestDto } from "./dto/find-messages-of-conversation.dto";

@ApiTags("Conversations")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({
  path: "conversations",
  version: "1",
})
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Public()
  @Get("/hc")
  healthCheck(): string {
    return "Conversations service is up and running!";
  }
  @Get("/current")
  async getCurrentUserConversation(@Req() req: Request, @Res() res: Response) {
    const result = await this.conversationsService.getUserConversation(req);
    res.status(result.statusCode).json(result.message);
  }

  @Post("/")
  async createConversation(@Req() req: Request, @Res() res: Response) {
    const userId = req.user?.["id"];
    const result = await this.conversationsService.createConversation(userId);
    res.status(result.statusCode).json(result.message);
  }

  @Post("/join/:id")
  async joinConversation(
    @Param("id") id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const result = await this.conversationsService.joinConversation(id, req);
    res.status(result.statusCode).json(result.message);
  }

  @Roles(RoleEnum.admin, RoleEnum.staff)
  @Get("/admin")
  async getConversationsStaff(
    @Query() query: FindAllConversationsDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const result = await this.conversationsService.getConversationsStaff(query);
    res.status(result.statusCode).json(result.message);
  }

  @Get("/:id/messages")
  async getConversationMessages(
    @Param("id") conversationId: string,
    @Query() query: FindAllMessageOfConversationRequestDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const result = await this.conversationsService.getConversationMessages(
      conversationId,
      query,
      req,
    );
    res.status(HttpStatus.OK).json({
      ...infinityPagination(result.chat, {
        page: query.page,
        limit: query.limit,
      }),
      page: query.page,
      limit: query.limit,
      total: result.count,
    });
  }
}
