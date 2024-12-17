import { MigrationInterface, QueryRunner } from "typeorm";

export class FullDefineConversationChat1732528368799
  implements MigrationInterface
{
  name = "FullDefineConversationChat1732528368799";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "conversation" ADD "conversationName" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "conversation" DROP COLUMN "conversationName"`,
    );
  }
}
