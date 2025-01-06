import { JwtAuthGuard } from "@/domain/auth/guards/jwt.guard";
import { CancelPaymentDto } from "@/domain/payment/dto/cancel-payment.dto";
import { CreatePaymentDto } from "@/domain/payment/dto/create-payment.dto";
import { PaymentService } from "@/domain/payment/payment.service";
import { Public } from "@/utils/decorators/public.decorator";
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import {
  CheckoutResponseDataType,
  PaymentLinkDataType,
} from "@payos/node/lib/type";
import { Request, Response } from "express";

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
    @Req() req: Request,
  ): Promise<CheckoutResponseDataType> {
    return this.paymentService.createEmbeddedPayment(req, body);
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

  @Public()
  @Post("/payment-webhook")
  webhookHandler(@Req() req: Request, @Res() res: Response) {
    // const result = await this.paymentService.webhookHandler(req);
    // res.status(result.statusCode).send(result.message);
    res.status(200).send(true);
  }
}
