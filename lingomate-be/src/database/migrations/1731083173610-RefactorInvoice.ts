import { MigrationInterface, QueryRunner } from "typeorm";

export class RefactorInvoice1731083173610 implements MigrationInterface {
  name = "RefactorInvoice1731083173610";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "invoice" ADD "userId" integer`);
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD CONSTRAINT "FK_f8e849201da83b87f78c7497dde" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "invoice" DROP CONSTRAINT "FK_f8e849201da83b87f78c7497dde"`,
    );
    await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "userId"`);
  }
}
