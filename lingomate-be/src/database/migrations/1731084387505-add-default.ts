import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDefault1731084387505 implements MigrationInterface {
  name = "AddDefault1731084387505";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "invoice" ALTER COLUMN "paymentStatus" SET DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "invoice" ALTER COLUMN "paymentStatus" DROP DEFAULT`,
    );
  }
}
