import { Injectable } from "@nestjs/common";
import { CreateInvoiceProductDto } from "./dto/create-invoice-product.dto";
import { UpdateInvoiceProductDto } from "./dto/update-invoice-product.dto";
import { InvoiceProductRepository } from "./infrastructure/persistence/invoice-product.repository";
import { IPaginationOptions } from "@/utils/types/pagination-options";
import { InvoiceProduct } from "./domain/invoice-product";

@Injectable()
export class InvoiceProductsService {
  constructor(
    private readonly invoiceProductRepository: InvoiceProductRepository,
  ) {}

  create(createInvoiceProductDto: CreateInvoiceProductDto) {
    return this.invoiceProductRepository.create(createInvoiceProductDto);
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.invoiceProductRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findOne(id: InvoiceProduct["id"]) {
    return this.invoiceProductRepository.findById(id);
  }

  update(
    id: InvoiceProduct["id"],
    updateInvoiceProductDto: UpdateInvoiceProductDto,
  ) {
    return this.invoiceProductRepository.update(id, updateInvoiceProductDto);
  }

  remove(id: InvoiceProduct["id"]) {
    return this.invoiceProductRepository.remove(id);
  }
}
