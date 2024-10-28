import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateQuestionEnum1730085055936 implements MigrationInterface {
  name = "UpdateQuestionEnum1730085055936";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."question_questiontype_enum" RENAME TO "question_questiontype_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."question_questiontype_enum" AS ENUM('CHOICE', 'INPUT')`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" ALTER COLUMN "questionType" TYPE "public"."question_questiontype_enum" USING "questionType"::"text"::"public"."question_questiontype_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."question_questiontype_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."question_filetype_enum" RENAME TO "question_filetype_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."question_filetype_enum" AS ENUM('AUDIO', 'IMAGE')`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" ALTER COLUMN "fileType" TYPE "public"."question_filetype_enum" USING "fileType"::"text"::"public"."question_filetype_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."question_filetype_enum_old"`);
    await queryRunner.query(
      `ALTER TABLE "question" ALTER COLUMN "time" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" ALTER COLUMN "content" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."question_filetype_enum_old" AS ENUM('0', '1')`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" ALTER COLUMN "fileType" TYPE "public"."question_filetype_enum_old" USING "fileType"::"text"::"public"."question_filetype_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."question_filetype_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."question_filetype_enum_old" RENAME TO "question_filetype_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."question_questiontype_enum_old" AS ENUM('0', '1')`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" ALTER COLUMN "questionType" TYPE "public"."question_questiontype_enum_old" USING "questionType"::"text"::"public"."question_questiontype_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."question_questiontype_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."question_questiontype_enum_old" RENAME TO "question_questiontype_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" ALTER COLUMN "time" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" ALTER COLUMN "content" SET NOT NULL`,
    );
  }
}
