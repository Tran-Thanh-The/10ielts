import { Inject, Injectable } from "@nestjs/common";
import PayOS from "@payos/node";
import {
  CheckoutRequestType,
  CheckoutResponseDataType,
  PaymentLinkDataType,
  WebhookDataType,
  WebhookType,
} from "@payos/node/lib/type";
import { ConfigService } from "@nestjs/config";
import { CreatePaymentDto } from "@/utils/dto/request/payos-request-payment.dto";

@Injectable()
export class PayOSService {
  private returnUrl: string;
  private cancelUrl: string;

  constructor(
    @Inject("PAYOS_CLIENT") private readonly payosClient: PayOS,
    private configService: ConfigService,
  ) {
    this.returnUrl =
      this.configService.get<string>("PAYOS_RETURN_URL", {
        infer: true,
      }) ?? "";
    this.cancelUrl =
      this.configService.get<string>("PAYOS_CANCEL_URL", {
        infer: true,
      }) ?? "";
  }

  async createPaymentLink(
    request: CreatePaymentDto,
  ): Promise<CheckoutResponseDataType> {
    const paymentData: CheckoutRequestType = {
      ...request,
      returnUrl: this.returnUrl,
      cancelUrl: this.cancelUrl,
    };
    const result = await this.payosClient.createPaymentLink(paymentData);
    return result;
  }

  async getPaymentLinkInformation(
    id: string | number,
  ): Promise<PaymentLinkDataType> {
    const result = await this.payosClient.getPaymentLinkInformation(id);
    return result;
  }

  async cancelPaymentLink(
    orderId: string | number,
    cancellationReason?: string,
  ): Promise<PaymentLinkDataType> {
    const result = await this.payosClient.cancelPaymentLink(
      orderId,
      cancellationReason,
    );
    return result;
  }

  async confirmWebhook(webhookUrl: string): Promise<string> {
    const result = await this.payosClient.confirmWebhook(webhookUrl);
    return result;
  }

  verifyPaymentWebhookData(webhookBody: WebhookType): WebhookDataType {
    const result = this.payosClient.verifyPaymentWebhookData(webhookBody);
    return result;
  }
}
