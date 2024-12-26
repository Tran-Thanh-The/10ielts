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

  async updateByOrderCode(orderCode: number, data: Partial<Invoice>) {
    await this.invoiceRepository.update(
      { orderCode },
      {
        paymentStatus: data.paymentStatus,
      },
    );
  }

  async findByOrderCode(orderCode: number): Promise<NullableType<Invoice>> {
    const entity = await this.invoiceRepository.findOne({
      where: { orderCode },
    });

    return entity ? InvoiceMapper.toDomain(entity) : null;
  }

  async getCurrentUserInvoices(userId: string, limit: number, page: number) {
    const queryBuilder = this.invoiceRepository
      .createQueryBuilder("invoice")
      .leftJoinAndSelect("invoice.invoiceProducts", "invoiceProducts")
      .leftJoinAndSelect("invoiceProducts.course", "course")
      .where("invoice.userId = :userId", { userId })
      .limit(limit)
      .offset((page - 1) * limit);

    const [invoices, total] = await queryBuilder.getManyAndCount();

    const result = invoices.map((invoice) => ({
      ...InvoiceMapper.toDomain(invoice),
      courseName: invoice.invoiceProducts[0]?.course.name,
      coursePrice: invoice.invoiceProducts[0]?.course.price,
    }));

    return {
      data: result,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getAllInvoices(limit: number, page: number, search?: string) {
    const queryBuilder = this.invoiceRepository
      .createQueryBuilder("invoice")
      .leftJoinAndSelect("invoice.invoiceProducts", "invoiceProducts")
      .leftJoinAndSelect("invoiceProducts.course", "course")
      .limit(limit)
      .offset((page - 1) * limit);

    if (search) {
      queryBuilder.where("course.name ILIKE :search", {
        search: `%${search}%`,
      });
    }

    const [invoices, total] = await queryBuilder.getManyAndCount();

    const result = invoices.map((invoice) => ({
      ...InvoiceMapper.toDomain(invoice),
      courseName: invoice.invoiceProducts[0]?.course.name,
      coursePrice: invoice.invoiceProducts[0]?.course.price,
    }));

    return {
      data: result,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getInvoiceDetail(id: string) {
    const queryBuilder = await this.invoiceRepository
      .createQueryBuilder("invoice")
      .leftJoinAndSelect("invoice.invoiceProducts", "invoiceProducts")
      .leftJoinAndSelect("invoiceProducts.course", "course")
      .where("invoice.id = :id", { id });

    const result = await queryBuilder.getOne();

    return result;
  }
}
