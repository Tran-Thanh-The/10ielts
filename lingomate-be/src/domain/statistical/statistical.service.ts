/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { InvoiceEntity } from "../invoices/infrastructure/persistence/relational/entities/invoice.entity";
import { Repository } from "typeorm";
import { RevenueByMonthOfAYearResponse, RawRevenueRow } from "./dto/revenue.dto";
import { Request } from "express";

@Injectable()
export class StatisticalService {
  constructor(
    @InjectRepository(InvoiceEntity)
    private readonly invoiceRepository: Repository<InvoiceEntity>,
  ) {}
  public async getRevenueStatistics(req: Request): Promise<RevenueByMonthOfAYearResponse[]> {
    const year = req.params.year;
    const rawQuery = `
      WITH monthly_invoices AS (
        SELECT
          EXTRACT(MONTH FROM "createdAt") AS month,
          "paymentStatus",
          "money"
        FROM invoice
        WHERE EXTRACT(YEAR FROM "createdAt") = $1
      )
      SELECT
        month,
        SUM(CASE WHEN "paymentStatus" = false THEN "money" ELSE 0 END) AS "notPay",
        SUM(CASE WHEN "paymentStatus" = true THEN "money" ELSE 0 END) AS "payed"
      FROM monthly_invoices
      GROUP BY month
      ORDER BY month;
    `;
    
    const rawResult: RawRevenueRow[] = await this.invoiceRepository.query(
      rawQuery,
      [year],
    );
    
    const result = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      notPay: 0,
      payed: 0,
    }));

    rawResult.forEach((row: RawRevenueRow) => {
      const monthIndex = row.month - 1;
      result[monthIndex].notPay = parseFloat(row.notPay);
      result[monthIndex].payed = parseFloat(row.payed);
    });

    return result;
  }
}
