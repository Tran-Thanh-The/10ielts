import { Module } from "@nestjs/common";
import { PaymentController } from "@/domain/payment/payment.controller";
import { PaymentService } from "@/domain/payment/payment.service";
import { InvoicesModule } from "@/domain/invoices/invoices.module";
import { CoursesModule } from "@/domain/courses/courses.module";
import { UserCoursesModule } from "@/domain/user-courses/user-courses.module";
import { InvoiceProductsModule } from "@/domain/invoice-products/invoice-products.module";
import { PracticeExercisesModule } from "@/domain/practice-exercises/practice-exercises.module";

@Module({
  imports: [
    InvoicesModule,
    CoursesModule,
    UserCoursesModule,
    InvoiceProductsModule,
    PracticeExercisesModule,
    UserCoursesModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
