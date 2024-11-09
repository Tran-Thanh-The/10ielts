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
import { InvoiceProductsService } from "./invoice-products.service";
import { CreateInvoiceProductDto } from "./dto/create-invoice-product.dto";
import { UpdateInvoiceProductDto } from "./dto/update-invoice-product.dto";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { InvoiceProduct } from "./domain/invoice-product";
import { AuthGuard } from "@nestjs/passport";
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from "@/utils/dto/infinity-pagination-response.dto";
import { infinityPagination } from "@/utils/infinity-pagination";
import { FindAllInvoiceProductsDto } from "./dto/find-all-invoice-products.dto";

@ApiTags("Invoiceproducts")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller({
  path: "invoice-products",
  version: "1",
})
export class InvoiceProductsController {
  constructor(
    private readonly invoiceProductsService: InvoiceProductsService,
  ) {}

  @Post()
  @ApiCreatedResponse({
    type: InvoiceProduct,
  })
  create(@Body() createInvoiceProductDto: CreateInvoiceProductDto) {
    return this.invoiceProductsService.create(createInvoiceProductDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(InvoiceProduct),
  })
  async findAll(
    @Query() query: FindAllInvoiceProductsDto,
  ): Promise<InfinityPaginationResponseDto<InvoiceProduct>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.invoiceProductsService.findAllWithPagination({
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
    type: InvoiceProduct,
  })
  findOne(@Param("id") id: string) {
    return this.invoiceProductsService.findOne(id);
  }

  @Patch(":id")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: InvoiceProduct,
  })
  update(
    @Param("id") id: string,
    @Body() updateInvoiceProductDto: UpdateInvoiceProductDto,
  ) {
    return this.invoiceProductsService.update(id, updateInvoiceProductDto);
  }

  @Delete(":id")
  @ApiParam({
    name: "id",
    type: String,
    required: true,
  })
  remove(@Param("id") id: string) {
    return this.invoiceProductsService.remove(id);
  }
}
