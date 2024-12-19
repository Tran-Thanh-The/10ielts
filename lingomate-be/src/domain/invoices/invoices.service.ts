import { Injectable } from "@nestjs/common";
import { CreateInvoiceDto } from "./dto/create-invoice.dto";
import { UpdateInvoiceDto } from "./dto/update-invoice.dto";
import { InvoiceRepository } from "./infrastructure/persistence/invoice.repository";
import { IPaginationOptions } from "@/utils/types/pagination-options";
import { Invoice } from "./domain/invoice";
import { InvoiceMapper } from "./infrastructure/persistence/relational/mappers/invoice.mapper";

@Injectable()
export class InvoicesService {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  create(createInvoiceDto: CreateInvoiceDto) {
    const model = InvoiceMapper.toModel(createInvoiceDto);
    return this.invoiceRepository.create(model);
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.invoiceRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findOne(id: Invoice["id"]) {
    return this.invoiceRepository.findById(id);
  }

  update(id: Invoice["id"], updateInvoiceDto: UpdateInvoiceDto) {
    return this.invoiceRepository.update(id, updateInvoiceDto);
  }

  remove(id: Invoice["id"]) {
    return this.invoiceRepository.remove(id);
  }

  updateByOrderCode(orderCode: number | string, data: Partial<Invoice>) {
    return this.invoiceRepository.updateByOrderCode(orderCode, data);
  }

  findByOrderCode(orderCode: number | string) {
    return this.invoiceRepository.findByOrderCode(orderCode);
  }
}
