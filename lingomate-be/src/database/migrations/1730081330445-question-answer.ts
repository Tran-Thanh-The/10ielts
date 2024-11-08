import { MigrationInterface, QueryRunner } from "typeorm";

export class QuestionAnswer1730081330445 implements MigrationInterface {
  name = "QuestionAnswer1730081330445";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "answer" DROP COLUMN "position"`);
    await queryRunner.query(`ALTER TABLE "answer" DROP COLUMN "answerText"`);
    await queryRunner.query(`ALTER TABLE "answer" DROP COLUMN "answerAudio"`);
    await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "audioUrl"`);
    await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "description"`);
    await queryRunner.query(
      `ALTER TABLE "answer" ADD "content" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "answer" ADD "fileId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "answer" ADD CONSTRAINT "UQ_8fda8a6b4c232fad97aa3f804ad" UNIQUE ("fileId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" ADD "content" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" ADD "explain" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "question" ADD "position" integer`);
    await queryRunner.query(
      `CREATE TYPE "public"."question_filetype_enum" AS ENUM('0', '1')`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" ADD "fileType" "public"."question_filetype_enum" NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "question" ADD "fileId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "question" ADD CONSTRAINT "UQ_af10052c31bf129d65e70b86778" UNIQUE ("fileId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "answer" ADD CONSTRAINT "FK_8fda8a6b4c232fad97aa3f804ad" FOREIGN KEY ("fileId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" ADD CONSTRAINT "FK_af10052c31bf129d65e70b86778" FOREIGN KEY ("fileId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "question" DROP CONSTRAINT "FK_af10052c31bf129d65e70b86778"`,
    );
    await queryRunner.query(
      `ALTER TABLE "answer" DROP CONSTRAINT "FK_8fda8a6b4c232fad97aa3f804ad"`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" DROP CONSTRAINT "UQ_af10052c31bf129d65e70b86778"`,
    );
    await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "fileId"`);
    await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "fileType"`);
    await queryRunner.query(`DROP TYPE "public"."question_filetype_enum"`);
    await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "position"`);
    await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "explain"`);
    await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "content"`);
    await queryRunner.query(
      `ALTER TABLE "answer" DROP CONSTRAINT "UQ_8fda8a6b4c232fad97aa3f804ad"`,
    );
    await queryRunner.query(`ALTER TABLE "answer" DROP COLUMN "fileId"`);
    await queryRunner.query(`ALTER TABLE "answer" DROP COLUMN "content"`);
    await queryRunner.query(
      `ALTER TABLE "question" ADD "description" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" ADD "audioUrl" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "answer" ADD "answerAudio" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "answer" ADD "answerText" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "answer" ADD "position" integer NOT NULL`,
    );
  }
}
