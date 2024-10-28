import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "@/domain/roles/roles.guard";
import { PaymentService } from "@/domain/payment/payment.service";
import { CheckoutRequestType } from "@payos/node/lib/type";

@ApiTags("Payment")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Controller({
  path: "payment",
  version: "1",
})
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // implement payment controller methods here
  @Post("/hc")
  healthCheck() {
    return "Payment service is up and running!";
  }

  @Post("/create-embedded-payment")
  async createEmbeddedPayment(@Body() body: CheckoutRequestType) {
    return this.paymentService.createEmbeddedPayment(body);
  }
}
