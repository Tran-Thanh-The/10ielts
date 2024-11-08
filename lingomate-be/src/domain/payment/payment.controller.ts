import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { PaymentService } from "@/domain/payment/payment.service";
import {
  CheckoutResponseDataType,
  PaymentLinkDataType,
} from "@payos/node/lib/type";
import { CreatePaymentDto } from "@/domain/payment/dto/create-payment.dto";
import { CancelPaymentDto } from "@/domain/payment/dto/cancel-payment.dto";
import { Public } from "@/utils/decorators/public.decorator";
import { JwtAuthGuard } from "@/domain/auth/guards/jwt.guard";

@ApiTags("Payment")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({
  path: "payment",
  version: "1",
})
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Public() // This route will bypass the AuthGuard
  @Get("/hc")
  healthCheck(): string {
    return "Payment service is up and running!";
  }

  @Post("/create-embedded-payment")
  async createEmbeddedPayment(
    @Body() body: CreatePaymentDto,
  ): Promise<CheckoutResponseDataType> {
    return this.paymentService.createEmbeddedPayment(body);
  }

  @Post("/cancel-payment-link")
  async cancelPaymentLink(
    @Body() body: CancelPaymentDto,
  ): Promise<PaymentLinkDataType> {
    return this.paymentService.cancelPaymentLink(
      body.orderId,
      body.cancellationReason,
    );
  }
}
