import { CreateInvoiceDto } from "@/domain/invoices/dto/create-invoice.dto";
import { Invoice } from "../../../../domain/invoice";
import { InvoiceEntity } from "../entities/invoice.entity";

export class InvoiceMapper {
  static toDomain(raw: InvoiceEntity): Invoice {
    const domainEntity = new Invoice();
    domainEntity.userId = raw.userId;
    domainEntity.paymentStatus = raw.paymentStatus;
    domainEntity.orderCode = raw.orderCode;
    domainEntity.id = raw.id;
    domainEntity.status = raw.status;
    domainEntity.description = raw.description;
    domainEntity.money = raw.money;
    domainEntity.name = raw.name;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    domainEntity.deletedAt = raw.deletedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Invoice): InvoiceEntity {
    const persistenceEntity = new InvoiceEntity();
    persistenceEntity.userId = domainEntity.userId;
    persistenceEntity.paymentStatus = domainEntity.paymentStatus;
    persistenceEntity.orderCode = domainEntity.orderCode;
    persistenceEntity.status = domainEntity.status;
    persistenceEntity.description = domainEntity.description;
    persistenceEntity.money = domainEntity.money;
    persistenceEntity.name = domainEntity.name;
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;
    persistenceEntity.deletedAt = domainEntity.deletedAt;

    return persistenceEntity;
  }

  static toModel(dto: CreateInvoiceDto): Invoice {
    const model = new Invoice();
    model.name = dto.name;
    model.description = dto.description;
    model.money = dto.money;
    model.status = dto.status;
    model.paymentStatus = dto.paymentStatus;
    model.orderCode = dto.orderCode;
    model.userId = dto.userId;
    return model;
  }
}
