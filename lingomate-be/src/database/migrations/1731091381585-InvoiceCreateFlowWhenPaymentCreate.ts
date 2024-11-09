import { MigrationInterface, QueryRunner } from "typeorm";

export class InvoiceCreateFlowWhenPaymentCreate1731091381585
  implements MigrationInterface
{
  name = "InvoiceCreateFlowWhenPaymentCreate1731091381585";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_da5996fb3139d3fe0256879cad"`,
    );
    await queryRunner.query(
      `CREATE TABLE "invoice_product" ("courseId" uuid, "practiceId" uuid, "invoiceId" uuid NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d79d227662ea59bababb37f2553" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cc3204afb98ea70a5b4826b939" ON "invoice_product" ("courseId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b5379e222862521cc1305038f9" ON "invoice_product" ("practiceId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_28451c43926a7b7e82b80b2d3c" ON "invoice_product" ("invoiceId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" DROP CONSTRAINT "FK_f8e849201da83b87f78c7497dde"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" ALTER COLUMN "userId" SET NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f8e849201da83b87f78c7497dd" ON "invoice" ("userId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD CONSTRAINT "FK_f8e849201da83b87f78c7497dde" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice_product" ADD CONSTRAINT "FK_b5379e222862521cc1305038f96" FOREIGN KEY ("practiceId") REFERENCES "practice_exercise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice_product" ADD CONSTRAINT "FK_28451c43926a7b7e82b80b2d3ca" FOREIGN KEY ("invoiceId") REFERENCES "invoice"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice_product" ADD CONSTRAINT "FK_cc3204afb98ea70a5b4826b9395" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "invoice_product" DROP CONSTRAINT "FK_cc3204afb98ea70a5b4826b9395"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice_product" DROP CONSTRAINT "FK_28451c43926a7b7e82b80b2d3ca"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice_product" DROP CONSTRAINT "FK_b5379e222862521cc1305038f96"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" DROP CONSTRAINT "FK_f8e849201da83b87f78c7497dde"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f8e849201da83b87f78c7497dd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" ALTER COLUMN "userId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD CONSTRAINT "FK_f8e849201da83b87f78c7497dde" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_28451c43926a7b7e82b80b2d3c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b5379e222862521cc1305038f9"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_cc3204afb98ea70a5b4826b939"`,
    );
    await queryRunner.query(`DROP TABLE "invoice_product"`);
    await queryRunner.query(
      `CREATE INDEX "IDX_da5996fb3139d3fe0256879cad" ON "invoice" ("orderCode") `,
    );
  }
}
