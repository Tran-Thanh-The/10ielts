import { Module } from "@nestjs/common";
import { InvoiceProductsService } from "./invoice-products.service";
import { InvoiceProductsController } from "./invoice-products.controller";
import { RelationalInvoiceProductPersistenceModule } from "./infrastructure/persistence/relational/relational-persistence.module";

@Module({
  imports: [RelationalInvoiceProductPersistenceModule],
  controllers: [InvoiceProductsController],
  providers: [InvoiceProductsService],
  exports: [InvoiceProductsService, RelationalInvoiceProductPersistenceModule],
})
export class InvoiceProductsModule {}
