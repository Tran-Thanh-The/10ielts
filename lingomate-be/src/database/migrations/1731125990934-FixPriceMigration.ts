import { MigrationInterface, QueryRunner } from "typeorm";

export class FixPriceMigration1731125990934 implements MigrationInterface {
  name = "FixPriceMigration1731125990934";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "conversation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_864528ec4274360a40f66c29845" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "chat" ("message" character varying NOT NULL, "conversationId" uuid NOT NULL, "userId" integer NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "fileId" uuid, CONSTRAINT "REL_4061ac4439ffff23d41f769ad1" UNIQUE ("fileId"), CONSTRAINT "PK_9d0b2ba74336710fd31154738a5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "practice_exercise" ALTER COLUMN "price" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_question" ALTER COLUMN "answerPick" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat" ADD CONSTRAINT "FK_4061ac4439ffff23d41f769ad15" FOREIGN KEY ("fileId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat" ADD CONSTRAINT "FK_52af74c7484586ef4bdfd8e4dbb" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat" ADD CONSTRAINT "FK_a19eb5a72b6d73ac18ccc84c64e" FOREIGN KEY ("conversationId") REFERENCES "conversation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "chat" DROP CONSTRAINT "FK_a19eb5a72b6d73ac18ccc84c64e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat" DROP CONSTRAINT "FK_52af74c7484586ef4bdfd8e4dbb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat" DROP CONSTRAINT "FK_4061ac4439ffff23d41f769ad15"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_question" ALTER COLUMN "answerPick" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "practice_exercise" ALTER COLUMN "price" SET NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE "chat"`);
    await queryRunner.query(`DROP TABLE "conversation"`);
  }
}
