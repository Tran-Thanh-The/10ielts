import { StatusEnum } from "@/common/enums/status.enum";
import { PayOSService } from "@/common/payos/payos.service";
import { CourseInvoicesService } from "@/domain/course-invoices/course-invoices.service";
import { CoursesService } from "@/domain/courses/courses.service";
import { InvoiceProductsService } from "@/domain/invoice-products/invoice-products.service";
import { InvoicesService } from "@/domain/invoices/invoices.service";
import { CreatePaymentDto } from "@/domain/payment/dto/create-payment.dto";
import { PracticeExercisesService } from "@/domain/practice-exercises/practice-exercises.service";
import { UserInvoicesService } from "@/domain/user-invoices/user-invoices.service";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import {
  PaymentLinkDataType,
  WebhookDataType,
  WebhookType,
} from "@payos/node/lib/type";
import { Request } from "express";
import { UserCoursesService } from "../user-courses/user-courses.service";

@Injectable()
export class PaymentService {
  constructor(
    private readonly payosService: PayOSService,
    private readonly courseService: CoursesService,
    private readonly invoicesService: InvoicesService,
    private readonly invoiceProductsService: InvoiceProductsService,
    private readonly practiceExerciseService: PracticeExercisesService,
    private readonly courseInvoicesService: CourseInvoicesService,
    private readonly userInvoicesService: UserInvoicesService,
    private readonly jwtService: JwtService,
    private readonly userCourseService: UserCoursesService,
  ) {}

  /**
   * @param req
   * @param body
   * @returns Promise<CheckoutResponseDataType>
   * export interface CreatePaymentDto {
   *   orderCode: number;
   *   amount: number;
   *   description: string;
   *   items?: Items[];
   *   buyerName?: string;
   *   buyerEmail?: string;
   *   buyerPhone?: string;
   *   buyerAddress?: string;
   *   expiredAt?: number;
   * }
   */
  public async createEmbeddedPayment(req: Request, body: CreatePaymentDto) {
    try {
      const orderCode = new Date().getTime();
      const product =
        body.type === "course"
          ? await this.courseService.findOne(body.id)
          : await this.practiceExerciseService.findOne(body.id);
      if (!product) {
        throw new Error("Product not found");
      }
      const invoiceDescription = `ORDER_${orderCode}_${req.user?.["id"]}`;
      const paymentRequest = {
        orderCode,
        amount: product.price ? Math.round(product.price) : 0,
        description: invoiceDescription,
      };
      console.log(orderCode, product.price, invoiceDescription);
      const invoiceCreated = await this.invoicesService.create({
        orderCode: orderCode,
        money: product.price ? product.price : 0,
        description: invoiceDescription,
        status: StatusEnum.ACTIVE,
        name: invoiceDescription,
        userId: req.user?.["id"],
        courseId: body.id,
        paymentStatus: false,
      });
      await this.invoiceProductsService.create({
        courseId: body.type === "course" ? body.id : null,
        invoiceId: invoiceCreated.id,
        practiceId: body.type === "course" ? null : body.id,
      });
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

  public async webhookHandler(req: Request) {
    try {
      const webhookData = req.body.data;
      const updateInvoice = await this.invoicesService.updateByOrderCode(
        webhookData.orderCode,
        {
          paymentStatus: true,
          updatedAt: new Date(),
        },
      );
      if (!updateInvoice) {
        throw new Error("Invoice not found");
      }
      const updatedInvoice = await this.invoicesService.findByOrderCode(
        webhookData.orderCode,
      );
      if (!updatedInvoice) {
        throw new Error("Invoice not found");
      }
      const productInvoice = await this.invoiceProductsService.findByInvoiceId(
        updatedInvoice.id,
      );
      if (!productInvoice) {
        throw new Error("Product invoice not found");
      }
      if (productInvoice[0].courseId) {
        await this.userCourseService.create(
          {
            course_id: productInvoice[0].courseId,
            user_id: req.user?.["id"],
          },
          req.user?.["id"],
        );
      }
      return {
        statusCode: 200,
        message: {
          success: true,
        },
      };
    } catch (error) {
      return {
        statusCode: 400,
        message: {
          success: false,
          error: error.message,
        },
      };
    }
  }
}
