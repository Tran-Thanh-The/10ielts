/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { InvoiceEntity } from "../invoices/infrastructure/persistence/relational/entities/invoice.entity";
import { Repository } from "typeorm";
import {
  RevenueByMonthOfAYearResponse,
  RawRevenueRow,
  StudentRegisterByMonthByYearResponse,
  RawStudentRegisterRow,
  AllCoursesRegisterStatisticsResponse,
  RawAllCoursesRegisterRow,
  MonthlyCoursesRegisterStatisticsResponse,
} from "./dto/revenue.dto";
import { Request } from "express";
import { UserCourseEntity } from "../user-courses/infrastructure/persistence/relational/entities/user-course.entity";
import { UserEntity } from "../users/infrastructure/persistence/relational/entities/user.entity";

@Injectable()
export class StatisticalService {
  constructor(
    @InjectRepository(InvoiceEntity)
    private readonly invoiceRepository: Repository<InvoiceEntity>,
    @InjectRepository(UserCourseEntity)
    private readonly userCourseRepository: Repository<UserCourseEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  public async getRevenueStatistics(
    req: Request,
  ): Promise<RevenueByMonthOfAYearResponse[]> {
    const year = Number(req.query.year);
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

  public async getStudentRegisterCoursesStatistics(
    req: Request,
  ): Promise<StudentRegisterByMonthByYearResponse[]> {
    const year = req.query.year;

    const rawQuery = `
      SELECT
        c.id as id,
        c.name AS course_name,
        EXTRACT(MONTH FROM uc."createdAt") AS month,
        COUNT(*) AS registration_count
      FROM user_course uc
      INNER JOIN course c ON c.id = uc."courseId"
      WHERE EXTRACT(YEAR FROM uc."createdAt") = $1
      GROUP BY c.id, c.name, month
      ORDER BY c.name, month ASC;
    `;

    const rawResult: RawStudentRegisterRow[] =
      await this.invoiceRepository.query(rawQuery, [year]);

    const result: StudentRegisterByMonthByYearResponse[] = [];

    rawResult.forEach((row) => {
      let course = result.find((c) => c.courseName === row.course_name);

      if (!course) {
        course = {
          courseId: row.id,
          courseName: row.course_name,
          data: Array.from({ length: 12 }, (_, i) => ({
            month: i + 1,
            registrationCount: 0,
          })),
        };
        result.push(course);
      }

      course.data[row.month - 1].registrationCount = parseInt(
        row.registration_count.toString(),
        10,
      );
    });

    return result;
  }

  public async getAllCoursesRegisterStatistics(
    req: Request,
  ): Promise<AllCoursesRegisterStatisticsResponse[]> {
    const year = req.query.year;

    const rawQuery = `
      SELECT
        c.id as id,
        c.name AS course_name,
        EXTRACT(MONTH FROM uc."createdAt") AS month,
        COUNT(*) AS registration_count
      FROM user_course uc
      INNER JOIN course c ON c.id = uc."courseId"
      WHERE EXTRACT(YEAR FROM uc."createdAt") = $1
      GROUP BY c.id, c.name, month
      ORDER BY c.name, month ASC;
    `;

    const rawResult: RawStudentRegisterRow[] =
      await this.invoiceRepository.query(rawQuery, [year]);

    const result: AllCoursesRegisterStatisticsResponse[] = [];

    rawResult.forEach((row) => {
      const monthIndex = Number(row.month); // monthIndex is already a number
      const course = result.find((c) => c.month === monthIndex);

      if (!course) {
        result.push({
          month: monthIndex,
          registrationCount: parseInt(row.registration_count.toString(), 10),
        });
      } else {
        course.registrationCount += parseInt(
          row.registration_count.toString(),
          10,
        );
      }
    });

    const sortedResult = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      registrationCount: 0,
    }));

    result.forEach((row) => {
      sortedResult[row.month - 1] = row;
    });

    return sortedResult;
  }

  public async getMonthlyCoursesRegisterStatistics(
    req: Request,
  ): Promise<MonthlyCoursesRegisterStatisticsResponse[]> {
    const [year, month] = [req.query.year, req.query.month];
    const queryParameter = `${year}-${month}`;
    const rawQuery = `
      SELECT
          c.name AS "courseName",
          COUNT(uc.*) AS "totalRegistration",
          ROUND(
              COUNT(uc.*) * 100.0 / SUM(COUNT(uc.*)) OVER (), 
              2
          ) AS "percentage"
      FROM
          user_course uc
      JOIN course c ON c.id = uc."courseId"
      WHERE
          uc.status = 'ACTIVE' -- Only count active registrations, if needed
      GROUP BY
          c.name, TO_CHAR(uc."createdAt", $1)
      ORDER BY
          "totalRegistration" DESC;
    `;

    const rawResult: RawAllCoursesRegisterRow[] =
      await this.userCourseRepository.query(rawQuery, [queryParameter]);

    return rawResult;
  }

  public async getUserAchievementStatistics(req: Request): Promise<any> {
    const currentUserId = req.user?.["id"];
    const courseBuyQuery = `
      with
          lessons_learned_cte as (
              select array_agg(ul."lessonId") as "lessonsLearned"
              from user_lesson ul
              where ul."userId" = $1
          )
      select
          (select count(*) from user_course uc where uc."userId" = $1) as "countCoursesBought",
          (select count(*) from user_lesson ul where ul."userId" = $1) as "totalLessonsLearned",
          (select count(q.*)
          from question q
          join lessons_learned_cte ll on q."lessonId" = any(ll."lessonsLearned")
          ) as "totalQuestionsDone",
          (select avg(ah."totalScore")
          from answer_history ah
          join lessons_learned_cte ll on ah."lessonId" = any(ll."lessonsLearned")
          ) as "averageScore";
    `;
    const courseBuyResult = await this.userCourseRepository.query(courseBuyQuery, [
      currentUserId,
    ]);
    return {
      countCoursesBought: Number(courseBuyResult[0].countCoursesBought),
      totalLearnedLessons: Number(courseBuyResult[0].totalLessonsLearned),
      totalQuestionsDone: Number(courseBuyResult[0].totalQuestionsDone),
      averageScore: Number(courseBuyResult[0].averageScore),
    };
  }
}
