import { MigrationInterface, QueryRunner } from "typeorm";

export class DropTableQuestionLesson1735012685061
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "question_lesson" CASCADE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "question_lesson" ("id" SERIAL NOT NULL, "paymentStatus" boolean NOT NULL DEFAULT false, "orderCode" bigint NOT NULL, "name" character varying NOT NULL, "description" character varying, "money" numeric(10,2) NOT NULL, CONSTRAINT "PK_8be709902b1e0f219efa28d7389" PRIMARY KEY ("id"))`,
    );
  }
}
