import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateRelationLesson1729851454743 implements MigrationInterface {
  name = "UpdateRelationLesson1729851454743";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "lesson" DROP COLUMN "videoUrl"`);
    await queryRunner.query(
      `ALTER TABLE "user_lesson" DROP COLUMN "isCompleted"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_course" ADD "currentLesson" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson" ADD "isSequence" boolean DEFAULT false`,
    );
    await queryRunner.query(`ALTER TABLE "lesson" ADD "videoUrlId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "lesson" ADD CONSTRAINT "UQ_81502d66796fdf1d3fc05d51e29" UNIQUE ("videoUrlId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_lesson" ADD "point" numeric(5,2) DEFAULT '0'`,
    );
    await queryRunner.query(`ALTER TABLE "user_lesson" ADD "practiceId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "question" ADD "time" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."answer_answertype_enum" RENAME TO "answer_answertype_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."answer_answertype_enum" AS ENUM('CHOICE', 'INPUT')`,
    );
    await queryRunner.query(
      `ALTER TABLE "answer" ALTER COLUMN "answerType" TYPE "public"."answer_answertype_enum" USING "answerType"::"text"::"public"."answer_answertype_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."answer_answertype_enum_old"`);
    await queryRunner.query(
      `ALTER TYPE "public"."lesson_lessontype_enum" RENAME TO "lesson_lessontype_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."lesson_lessontype_enum" AS ENUM('VIDEO', 'DOCS', 'EXERCISE')`,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson" ALTER COLUMN "lessonType" TYPE "public"."lesson_lessontype_enum" USING "lessonType"::"text"::"public"."lesson_lessontype_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."lesson_lessontype_enum_old"`);
    await queryRunner.query(
      `ALTER TYPE "public"."question_questiontype_enum" RENAME TO "question_questiontype_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."question_questiontype_enum" AS ENUM('0', '1')`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" ALTER COLUMN "questionType" TYPE "public"."question_questiontype_enum" USING "questionType"::"text"::"public"."question_questiontype_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."question_questiontype_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson" ADD CONSTRAINT "FK_81502d66796fdf1d3fc05d51e29" FOREIGN KEY ("videoUrlId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_lesson" ADD CONSTRAINT "FK_bc19900ad5a9b0136a797a6b8c9" FOREIGN KEY ("practiceId") REFERENCES "practice_exercise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_lesson" DROP CONSTRAINT "FK_bc19900ad5a9b0136a797a6b8c9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson" DROP CONSTRAINT "FK_81502d66796fdf1d3fc05d51e29"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."question_questiontype_enum_old" AS ENUM('Choice', 'Paragraph', 'Sentence', 'Audio_sentence', 'Audio_paragraph')`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" ALTER COLUMN "questionType" TYPE "public"."question_questiontype_enum_old" USING "questionType"::"text"::"public"."question_questiontype_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."question_questiontype_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."question_questiontype_enum_old" RENAME TO "question_questiontype_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."lesson_lessontype_enum_old" AS ENUM('Video', 'Docs', 'Exercise')`,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson" ALTER COLUMN "lessonType" TYPE "public"."lesson_lessontype_enum_old" USING "lessonType"::"text"::"public"."lesson_lessontype_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."lesson_lessontype_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."lesson_lessontype_enum_old" RENAME TO "lesson_lessontype_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."answer_answertype_enum_old" AS ENUM('Choice', 'Paragraph', 'Sentence', 'Audio_sentence', 'Audio_paragraph')`,
    );
    await queryRunner.query(
      `ALTER TABLE "answer" ALTER COLUMN "answerType" TYPE "public"."answer_answertype_enum_old" USING "answerType"::"text"::"public"."answer_answertype_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."answer_answertype_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."answer_answertype_enum_old" RENAME TO "answer_answertype_enum"`,
    );
    await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "time"`);
    await queryRunner.query(
      `ALTER TABLE "user_lesson" DROP COLUMN "practiceId"`,
    );
    await queryRunner.query(`ALTER TABLE "user_lesson" DROP COLUMN "point"`);
    await queryRunner.query(
      `ALTER TABLE "lesson" DROP CONSTRAINT "UQ_81502d66796fdf1d3fc05d51e29"`,
    );
    await queryRunner.query(`ALTER TABLE "lesson" DROP COLUMN "videoUrlId"`);
    await queryRunner.query(`ALTER TABLE "lesson" DROP COLUMN "isSequence"`);
    await queryRunner.query(
      `ALTER TABLE "user_course" DROP COLUMN "currentLesson"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_lesson" ADD "isCompleted" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson" ADD "videoUrl" character varying`,
    );
  }
}
