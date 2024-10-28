import { Injectable } from "@nestjs/common";
import { PayOSService } from "@/common/payos/payos.service";
import { InvoicesService } from "@/domain/invoices/invoices.service";
import { CourseInvoicesService } from "@/domain/course-invoices/course-invoices.service";
import { UserInvoicesService } from "@/domain/user-invoices/user-invoices.service";
import { CheckoutRequestType } from "@payos/node/lib/type";

@Injectable()
export class PaymentService {
  constructor(
    private readonly payosService: PayOSService,
    private readonly invoicesService: InvoicesService,
    private readonly courseInvoicesService: CourseInvoicesService,
    private readonly userInVoicesService: UserInvoicesService,
  ) {}

  async createEmbeddedPayment(body: CheckoutRequestType) {
    try {
      const paymentLinkReponse =
        await this.payosService.createPaymentLink(body);
      return paymentLinkReponse;
    } catch (error) {
      throw error;
    }
  }
}
