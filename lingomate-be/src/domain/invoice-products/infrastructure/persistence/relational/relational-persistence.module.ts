import { Module } from "@nestjs/common";
import { InvoiceProductRepository } from "../invoice-product.repository";
import { InvoiceProductRelationalRepository } from "./repositories/invoice-product.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InvoiceProductEntity } from "./entities/invoice-product.entity";

@Module({
  imports: [TypeOrmModule.forFeature([InvoiceProductEntity])],
  providers: [
    {
      provide: InvoiceProductRepository,
      useClass: InvoiceProductRelationalRepository,
    },
  ],
  exports: [InvoiceProductRepository],
})
export class RelationalInvoiceProductPersistenceModule {}
