import { MigrationInterface, QueryRunner } from "typeorm";

export class DropUserInvoicesAndCourseInvoiceTable1734715833907
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "user_invoices" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "course_invoices" CASCADE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "course_invoice" ("id" SERIAL NOT NULL, "paymentStatus" boolean NOT NULL DEFAULT false, "orderCode" bigint NOT NULL, "name" character varying NOT NULL, "description" character varying, "money" numeric(10,2) NOT NULL, CONSTRAINT "PK_3a5a5c4f8e1e5c5f2f2b2d4b9f8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_invoices" ("id" SERIAL NOT NULL, "paymentStatus" boolean NOT NULL DEFAULT false, "orderCode" bigint NOT NULL, "name" character varying NOT NULL, "description" character varying, "money" numeric(10,2) NOT NULL, CONSTRAINT "PK_7c4d7e8e9f4d3d7f7b3f7b7b7b7" PRIMARY KEY ("id"))`,
    );
  }
}
