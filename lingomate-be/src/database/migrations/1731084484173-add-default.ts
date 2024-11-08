import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDefault1731084484173 implements MigrationInterface {
  name = "AddDefault1731084484173";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_da5996fb3139d3fe0256879cad"`,
    );
    await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "orderCode"`);
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD "orderCode" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD CONSTRAINT "UQ_da5996fb3139d3fe0256879cad9" UNIQUE ("orderCode")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_da5996fb3139d3fe0256879cad" ON "invoice" ("orderCode") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_da5996fb3139d3fe0256879cad"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" DROP CONSTRAINT "UQ_da5996fb3139d3fe0256879cad9"`,
    );
    await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "orderCode"`);
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD "orderCode" integer NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_da5996fb3139d3fe0256879cad" ON "invoice" ("orderCode") `,
    );
  }
}
