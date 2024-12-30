import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAiReviewFieldAnswerHistory1735485061410
  implements MigrationInterface
{
  name = "AddAiReviewFieldAnswerHistory1735485061410";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "answer_history" ADD "aiReview" jsonb`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "answer_history" DROP COLUMN "aiReview"`,
    );
  }
}
