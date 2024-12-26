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
  Req,
  Res,
} from "@nestjs/common";
import { InvoicesService } from "./invoices.service";
import { CreateInvoiceDto } from "./dto/create-invoice.dto";
import { UpdateInvoiceDto } from "./dto/update-invoice.dto";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { Invoice } from "./domain/invoice";
import { AuthGuard } from "@nestjs/passport";
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from "@/utils/dto/infinity-pagination-response.dto";
import { infinityPagination } from "@/utils/infinity-pagination";
import { FindAllInvoicesDto } from "./dto/find-all-invoices.dto";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { Public } from "@/utils/decorators/public.decorator";
import { Request, Response } from "express";
import { PermissionGuard } from "@/guards/permission.guard";
import { Roles } from "@/utils/decorators/roles.decorator";
import { RoleEnum } from "@/common/enums/roles.enum";
import { PaginationOptionsDto } from "../answer-histories/dto/find-all-answer-histories.dto";

@ApiTags("Invoices")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AuthGuard("jwt"), PermissionGuard)
@Controller({
  path: "invoices",
  version: "1",
})
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Roles(RoleEnum.admin, RoleEnum.staff, RoleEnum.teacher)
  @Get()
  async getAllInvoices(
    @Query() query: FindAllInvoicesDto,
    @Query() pagination: PaginationOptionsDto,
  ): Promise<InfinityPaginationResponseDto<Invoice>> {
    const page = pagination?.page ?? 1;
    let limit = pagination?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    const invoices = await this.invoicesService.findAllWithPagination({
      paginationOptions: { page, limit },
    });

    return infinityPagination(invoices, { page, limit });
  }

  @Get("current-user")
  async getCurrentUserInvoices(
    @Query() query: FindAllInvoicesDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const invoices = await this.invoicesService.getCurrentUserInvoices(
        req,
        query,
      );
      return res.status(200).json(invoices);
    } catch (e) {
      return res.status(500).json({ message: `Error: ${e}` });
    }
  }

  @Get(":id")
  async invoiceDetail(
    @Param("id") id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      console.log("id", id);
      const invoice = await this.invoicesService.getInvoiceDetail(id);
      return res.status(200).json(invoice);
    } catch (e) {
      return res.status(500).json({ message: `Error: ${e}` });
    }
  }
}
