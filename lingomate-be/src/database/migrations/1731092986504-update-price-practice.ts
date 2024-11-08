import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePricePractice1731092986504 implements MigrationInterface {
  name = "UpdatePricePractice1731092986504";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "practice_exercise" ALTER COLUMN "price" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "practice_exercise" ALTER COLUMN "price" SET NOT NULL`,
    );
  }
}
