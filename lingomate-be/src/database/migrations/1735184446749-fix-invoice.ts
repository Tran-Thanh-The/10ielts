import { MigrationInterface, QueryRunner } from "typeorm";

export class FixInvoice1735184446749 implements MigrationInterface {
  name = "FixInvoice1735184446749";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f8e849201da83b87f78c7497dd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" ALTER COLUMN "userId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD CONSTRAINT "FK_f8e849201da83b87f78c7497dde" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "invoice" DROP CONSTRAINT "FK_f8e849201da83b87f78c7497dde"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" ALTER COLUMN "userId" SET NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f8e849201da83b87f78c7497dd" ON "invoice" ("userId") `,
    );
  }
}
