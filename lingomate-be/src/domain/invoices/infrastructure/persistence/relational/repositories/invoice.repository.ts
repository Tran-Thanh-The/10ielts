import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { InvoiceEntity } from "../entities/invoice.entity";
import { NullableType } from "@/utils/types/nullable.type";
import { Invoice } from "../../../../domain/invoice";
import { InvoiceRepository } from "../../invoice.repository";
import { InvoiceMapper } from "../mappers/invoice.mapper";
import { IPaginationOptions } from "@/utils/types/pagination-options";

@Injectable()
export class InvoiceRelationalRepository implements InvoiceRepository {
  constructor(
    @InjectRepository(InvoiceEntity)
    private readonly invoiceRepository: Repository<InvoiceEntity>,
  ) {}

  async create(data: Invoice): Promise<Invoice> {
    const persistenceModel = InvoiceMapper.toPersistence(data);
    const newEntity = await this.invoiceRepository.save(
      this.invoiceRepository.create(persistenceModel),
    );
    return InvoiceMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Invoice[]> {
    const entities = await this.invoiceRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => InvoiceMapper.toDomain(entity));
  }

  async findById(id: Invoice["id"]): Promise<NullableType<Invoice>> {
    const entity = await this.invoiceRepository.findOne({
      where: { id },
    });

    return entity ? InvoiceMapper.toDomain(entity) : null;
  }

  async update(id: Invoice["id"], payload: Partial<Invoice>): Promise<Invoice> {
    const entity = await this.invoiceRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error("Record not found");
    }

    const updatedEntity = await this.invoiceRepository.save(
      this.invoiceRepository.create(
        InvoiceMapper.toPersistence({
          ...InvoiceMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return InvoiceMapper.toDomain(updatedEntity);
  }

  async remove(id: Invoice["id"]): Promise<void> {
    await this.invoiceRepository.delete(id);
  }
}
