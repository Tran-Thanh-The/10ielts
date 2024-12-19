/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { InvoiceEntity } from "../invoices/infrastructure/persistence/relational/entities/invoice.entity";
import { Repository } from "typeorm";
import { RevenueByMonthOfAYearResponse } from "./dto/revenue.dto";
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
      SELECT
        EXTRACT(MONTH FROM "createdAt") AS month,
        SUM(CASE WHEN "paymentStatus" = false THEN "money" ELSE 0 END) AS "notPay",
        SUM(CASE WHEN "paymentStatus" = true THEN "money" ELSE 0 END) AS "payed"
      FROM invoice
      WHERE EXTRACT(YEAR FROM "createdAt") = $1
      GROUP BY EXTRACT(MONTH FROM "createdAt")
      ORDER BY month;
    `;
    
    const rawResult = await this.invoiceRepository.query(
      rawQuery,
      [year],
    );
    
    const result = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      notPay: 0,
      payed: 0,
    }));

    rawResult.forEach((row) => {
      const monthIndex = row.month - 1;
      result[monthIndex].notPay = parseFloat(row.notPay);
      result[monthIndex].payed = parseFloat(row.payed);
    });

    return result;
  }
}
