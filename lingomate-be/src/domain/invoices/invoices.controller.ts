import { RoleEnum } from "@/common/enums/roles.enum";
import { PermissionGuard } from "@/guards/permission.guard";
import { Roles } from "@/utils/decorators/roles.decorator";
import { InfinityPaginationResponseDto } from "@/utils/dto/infinity-pagination-response.dto";
import { infinityPagination } from "@/utils/infinity-pagination";
import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Query,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { Request, Response } from "express";
import { PaginationOptionsDto } from "../answer-histories/dto/find-all-answer-histories.dto";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { Invoice } from "./domain/invoice";
import { FindAllInvoicesDto } from "./dto/find-all-invoices.dto";
import { UpdateInvoiceDto } from "./dto/update-invoice.dto";
import { InvoicesService } from "./invoices.service";

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
      res.status(200).json(invoices);
    } catch (e) {
      res.status(500).json({ message: `Error: ${e}` });
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
      res.status(200).json(invoice);
    } catch (e) {
      res.status(500).json({ message: `Error: ${e}` });
    }
  }

  @Roles(
    RoleEnum.admin,
    RoleEnum.staff,
    RoleEnum.teacher,
    RoleEnum.customerCare,
  )
  @Patch(":id")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Invoice,
  })
  update(@Param("id") id: string, @Body() updateInvoiceDto: UpdateInvoiceDto) {
    try {
      return this.invoicesService.update(id, updateInvoiceDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        "An error occurred while updating the course. Please try again later.",
      );
    }
  }
}
