import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { InvoiceProductEntity } from "../entities/invoice-product.entity";
import { NullableType } from "@/utils/types/nullable.type";
import { InvoiceProduct } from "@/domain/invoice-products/domain/invoice-product";
import { InvoiceProductRepository } from "../../invoice-product.repository";
import { InvoiceProductMapper } from "../mappers/invoice-product.mapper";
import { IPaginationOptions } from "@/utils/types/pagination-options";

@Injectable()
export class InvoiceProductRelationalRepository
  implements InvoiceProductRepository
{
  constructor(
    @InjectRepository(InvoiceProductEntity)
    private readonly invoiceProductRepository: Repository<InvoiceProductEntity>,
  ) {}

  async create(data: InvoiceProduct): Promise<InvoiceProduct> {
    const persistenceModel = InvoiceProductMapper.toPersistence(data);
    const newEntity = await this.invoiceProductRepository.save(
      this.invoiceProductRepository.create(persistenceModel),
    );
    return InvoiceProductMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<InvoiceProduct[]> {
    const entities = await this.invoiceProductRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => InvoiceProductMapper.toDomain(entity));
  }

  async findById(
    id: InvoiceProduct["id"],
  ): Promise<NullableType<InvoiceProduct>> {
    const entity = await this.invoiceProductRepository.findOne({
      where: { id },
    });

    return entity ? InvoiceProductMapper.toDomain(entity) : null;
  }

  async update(
    id: InvoiceProduct["id"],
    payload: Partial<InvoiceProduct>,
  ): Promise<InvoiceProduct> {
    const entity = await this.invoiceProductRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error("Record not found");
    }

    const updatedEntity = await this.invoiceProductRepository.save(
      this.invoiceProductRepository.create(
        InvoiceProductMapper.toPersistence({
          ...InvoiceProductMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return InvoiceProductMapper.toDomain(updatedEntity);
  }

  async remove(id: InvoiceProduct["id"]): Promise<void> {
    await this.invoiceProductRepository.delete(id);
  }

  async findByInvoiceId(
    id: InvoiceProduct["invoiceId"],
  ): Promise<InvoiceProduct[]> {
    const entities = await this.invoiceProductRepository.find({
      where: { invoiceId: id },
    });
    return entities.map((entity) => InvoiceProductMapper.toDomain(entity));
  }
}
