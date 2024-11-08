import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateLessonQuestion1730041829018 implements MigrationInterface {
  name = "UpdateLessonQuestion1730041829018";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lesson" DROP CONSTRAINT "FK_81502d66796fdf1d3fc05d51e29"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson" RENAME COLUMN "videoUrlId" TO "fileId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson" RENAME CONSTRAINT "UQ_81502d66796fdf1d3fc05d51e29" TO "UQ_dd4991fde2715fcee5ded020af5"`,
    );
    await queryRunner.query(`ALTER TABLE "question" ADD "lessonId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "lesson" ADD CONSTRAINT "FK_dd4991fde2715fcee5ded020af5" FOREIGN KEY ("fileId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" ADD CONSTRAINT "FK_328503a049ab618608e47b50742" FOREIGN KEY ("lessonId") REFERENCES "lesson"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "question" DROP CONSTRAINT "FK_328503a049ab618608e47b50742"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson" DROP CONSTRAINT "FK_dd4991fde2715fcee5ded020af5"`,
    );
    await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "lessonId"`);
    await queryRunner.query(
      `ALTER TABLE "lesson" RENAME CONSTRAINT "UQ_dd4991fde2715fcee5ded020af5" TO "UQ_81502d66796fdf1d3fc05d51e29"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson" RENAME COLUMN "fileId" TO "videoUrlId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson" ADD CONSTRAINT "FK_81502d66796fdf1d3fc05d51e29" FOREIGN KEY ("videoUrlId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
