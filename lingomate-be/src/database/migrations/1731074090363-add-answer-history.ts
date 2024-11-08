import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAnswerHistory1731074090363 implements MigrationInterface {
  name = "AddAnswerHistory1731074090363";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_lesson" DROP CONSTRAINT "FK_bc19900ad5a9b0136a797a6b8c9"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."answer_history_status_enum" AS ENUM('ACTIVE', 'IN_ACTIVE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "answer_history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "totalScore" numeric(5,2) DEFAULT '0', "status" "public"."answer_history_status_enum" NOT NULL DEFAULT 'IN_ACTIVE', "startedAt" TIMESTAMP WITH TIME ZONE, "completedAt" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "practiceId" uuid, "lessonId" uuid, CONSTRAINT "PK_9472abb33368f92ec10b9ef4a01" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "user_lesson" DROP COLUMN "point"`);
    await queryRunner.query(
      `ALTER TABLE "user_lesson" DROP COLUMN "practiceId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "practice_exercise" ADD "title" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "practice_exercise" ADD "description" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "practice_exercise" ADD "price" numeric(10,2) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "practice_exercise" ADD "content" character varying`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."practice_exercise_practicetype_enum" AS ENUM('READING', 'LISTENING', 'WRITING', 'SPEAKING')`,
    );
    await queryRunner.query(
      `ALTER TABLE "practice_exercise" ADD "practiceType" "public"."practice_exercise_practicetype_enum" NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."practice_exercise_difficulty_enum" AS ENUM('EASY', 'MEDIUM', 'HARD')`,
    );
    await queryRunner.query(
      `ALTER TABLE "practice_exercise" ADD "difficulty" "public"."practice_exercise_difficulty_enum" NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."practice_exercise_status_enum" AS ENUM('ACTIVE', 'IN_ACTIVE')`,
    );
    await queryRunner.query(
      `ALTER TABLE "practice_exercise" ADD "status" "public"."practice_exercise_status_enum" NOT NULL DEFAULT 'IN_ACTIVE'`,
    );
    await queryRunner.query(
      `ALTER TABLE "practice_exercise" ADD "userId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_lesson" ADD "isCompleted" boolean DEFAULT false`,
    );
    await queryRunner.query(`ALTER TABLE "question" ADD "practiceId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "lesson" ALTER COLUMN "status" SET DEFAULT 'IN_ACTIVE'`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" ALTER COLUMN "status" SET DEFAULT 'IN_ACTIVE'`,
    );
    await queryRunner.query(
      `ALTER TABLE "practice_exercise" ADD CONSTRAINT "FK_7463393b4c62f8addce295dd652" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "answer_history" ADD CONSTRAINT "FK_311fa38834d137c77ff019736b1" FOREIGN KEY ("practiceId") REFERENCES "practice_exercise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "answer_history" ADD CONSTRAINT "FK_45c906a7861652197e2f200ac5e" FOREIGN KEY ("lessonId") REFERENCES "lesson"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" ADD CONSTRAINT "FK_2bbdf8c277261518e9f09d824d5" FOREIGN KEY ("practiceId") REFERENCES "practice_exercise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "question" DROP CONSTRAINT "FK_2bbdf8c277261518e9f09d824d5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "answer_history" DROP CONSTRAINT "FK_45c906a7861652197e2f200ac5e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "answer_history" DROP CONSTRAINT "FK_311fa38834d137c77ff019736b1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "practice_exercise" DROP CONSTRAINT "FK_7463393b4c62f8addce295dd652"`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" ALTER COLUMN "status" SET DEFAULT 'ACTIVE'`,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson" ALTER COLUMN "status" SET DEFAULT 'ACTIVE'`,
    );
    await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "practiceId"`);
    await queryRunner.query(
      `ALTER TABLE "user_lesson" DROP COLUMN "isCompleted"`,
    );
    await queryRunner.query(
      `ALTER TABLE "practice_exercise" DROP COLUMN "userId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "practice_exercise" DROP COLUMN "status"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."practice_exercise_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "practice_exercise" DROP COLUMN "difficulty"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."practice_exercise_difficulty_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "practice_exercise" DROP COLUMN "practiceType"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."practice_exercise_practicetype_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "practice_exercise" DROP COLUMN "content"`,
    );
    await queryRunner.query(
      `ALTER TABLE "practice_exercise" DROP COLUMN "price"`,
    );
    await queryRunner.query(
      `ALTER TABLE "practice_exercise" DROP COLUMN "description"`,
    );
    await queryRunner.query(
      `ALTER TABLE "practice_exercise" DROP COLUMN "title"`,
    );
    await queryRunner.query(`ALTER TABLE "user_lesson" ADD "practiceId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "user_lesson" ADD "point" numeric(5,2) DEFAULT '0'`,
    );
    await queryRunner.query(`DROP TABLE "answer_history"`);
    await queryRunner.query(`DROP TYPE "public"."answer_history_status_enum"`);
    await queryRunner.query(
      `ALTER TABLE "user_lesson" ADD CONSTRAINT "FK_bc19900ad5a9b0136a797a6b8c9" FOREIGN KEY ("practiceId") REFERENCES "practice_exercise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
