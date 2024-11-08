import { Injectable } from "@nestjs/common";
import { PayOSService } from "@/common/payos/payos.service";
import { InvoicesService } from "@/domain/invoices/invoices.service";
import { CourseInvoicesService } from "@/domain/course-invoices/course-invoices.service";
import { UserInvoicesService } from "@/domain/user-invoices/user-invoices.service";
import { CreatePaymentDto } from "@/domain/payment/dto/create-payment.dto";
import {
  PaymentLinkDataType,
  WebhookDataType,
  WebhookType,
} from "@payos/node/lib/type";

@Injectable()
export class PaymentService {
  constructor(
    private readonly payosService: PayOSService,
    private readonly invoicesService: InvoicesService,
    private readonly courseInvoicesService: CourseInvoicesService,
    private readonly userInVoicesService: UserInvoicesService,
  ) {}

  public async createEmbeddedPayment(body: CreatePaymentDto) {
    try {
      // const paymentRequest: CheckoutRequestType = {
      // generate orderCode by uuidv4 and dateTime
      const orderCode = new Date().getTime();
      const paymentRequest = {
        orderCode,
        ...body,
      };
      const paymentLinkReponse =
        await this.payosService.createPaymentLink(paymentRequest);
      return paymentLinkReponse;
    } catch (error) {
      throw error;
    }
  }

  public async getPaymentLinkInformation(
    orderId: string | number,
  ): Promise<PaymentLinkDataType> {
    try {
      const paymentLinkInformation =
        await this.payosService.getPaymentLinkInformation(orderId);
      return paymentLinkInformation;
    } catch (error) {
      throw error;
    }
  }

  public async cancelPaymentLink(
    orderId: string | number,
    cancellationReason?: string,
  ): Promise<PaymentLinkDataType> {
    try {
      const paymentLinkInformation = await this.payosService.cancelPaymentLink(
        orderId,
        cancellationReason,
      );
      return paymentLinkInformation;
    } catch (error) {
      throw error;
    }
  }

  public async confirmWebhookPayment(webhookUrl: string): Promise<string> {
    try {
      const result = await this.payosService.confirmWebhook(webhookUrl);
      return result;
    } catch (error) {
      throw error;
    }
  }

  public verifyPaymentWebhookData(webhookBody: WebhookType): WebhookDataType {
    try {
      const result = this.payosService.verifyPaymentWebhookData(webhookBody);
      return result;
    } catch (error) {
      throw error;
    }
  }
}
