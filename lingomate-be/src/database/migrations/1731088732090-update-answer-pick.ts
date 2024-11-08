import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateAnswerPick1731088732090 implements MigrationInterface {
  name = "UpdateAnswerPick1731088732090";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_question" ALTER COLUMN "answerPick" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_question" ALTER COLUMN "answerPick" SET NOT NULL`,
    );
  }
}
