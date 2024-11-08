import { InvoiceProduct } from "@/domain/invoice-products/domain/invoice-product";
import { InvoiceProductEntity } from "../entities/invoice-product.entity";

export class InvoiceProductMapper {
  static toDomain(raw: InvoiceProductEntity): InvoiceProduct {
    const domainEntity = new InvoiceProduct();
    domainEntity.courseId = raw.courseId;
    domainEntity.invoiceId = raw.invoiceId;
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: InvoiceProduct): InvoiceProductEntity {
    const persistenceEntity = new InvoiceProductEntity();
    persistenceEntity.courseId = domainEntity.courseId;
    persistenceEntity.invoiceId = domainEntity.invoiceId;
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
