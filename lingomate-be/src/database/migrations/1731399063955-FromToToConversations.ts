import { MigrationInterface, QueryRunner } from "typeorm";

export class FromToToConversations1731399063955 implements MigrationInterface {
  name = "FromToToConversations1731399063955";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "conversation" ADD "to" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversation" ADD "from" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversation" ADD "toConversationId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversation" ADD "fromConversationId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversation" ADD CONSTRAINT "FK_a8be5f043726a3fb3c841218e1d" FOREIGN KEY ("toConversationId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversation" ADD CONSTRAINT "FK_8e537fc6518a6b08d2c892cb02c" FOREIGN KEY ("fromConversationId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "conversation" DROP CONSTRAINT "FK_8e537fc6518a6b08d2c892cb02c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversation" DROP CONSTRAINT "FK_a8be5f043726a3fb3c841218e1d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversation" DROP COLUMN "fromConversationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversation" DROP COLUMN "toConversationId"`,
    );
    await queryRunner.query(`ALTER TABLE "conversation" DROP COLUMN "from"`);
    await queryRunner.query(`ALTER TABLE "conversation" DROP COLUMN "to"`);
  }
}
