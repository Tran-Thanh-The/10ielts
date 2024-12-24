import { Module } from "@nestjs/common";
import { StatisticalController } from "./statistical.controller";
import { StatisticalService } from "./statistical.service";
import { InvoicesModule } from "../invoices/invoices.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InvoiceEntity } from "../invoices/infrastructure/persistence/relational/entities/invoice.entity";
import { UserCourseEntity } from "../user-courses/infrastructure/persistence/relational/entities/user-course.entity";

@Module({
  imports: [
    InvoicesModule,
    TypeOrmModule.forFeature([InvoiceEntity, UserCourseEntity]),
  ],
  controllers: [StatisticalController],
  providers: [StatisticalService],
  exports: [],
})
export class StatisticalModule {}
