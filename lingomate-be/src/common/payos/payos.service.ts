import { Inject, Injectable } from "@nestjs/common";
import PayOS from "@payos/node";
import {
  CheckoutRequestType,
  CheckoutResponseDataType,
  PaymentLinkDataType,
  WebhookDataType,
  WebhookType,
} from "@payos/node/lib/type";

@Injectable()
export class PayOSService {
  constructor(@Inject("PAYOS_CLIENT") private readonly payosClient: PayOS) {}

  async createPaymentLink(
    request: CheckoutRequestType,
  ): Promise<CheckoutResponseDataType> {
    const result = await this.payosClient.createPaymentLink(request);
    return result;
  }

  async getPaymentLinkInformation(id: string): Promise<PaymentLinkDataType> {
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
