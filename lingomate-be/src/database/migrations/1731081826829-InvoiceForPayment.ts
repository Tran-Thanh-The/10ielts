import { MigrationInterface, QueryRunner } from "typeorm";

export class InvoiceForPayment1731081826829 implements MigrationInterface {
  name = "InvoiceForPayment1731081826829";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD "paymentStatus" boolean NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD "orderCode" integer NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_da5996fb3139d3fe0256879cad" ON "invoice" ("orderCode") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_da5996fb3139d3fe0256879cad"`,
    );
    await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "orderCode"`);
    await queryRunner.query(
      `ALTER TABLE "invoice" DROP COLUMN "paymentStatus"`,
    );
  }
}
