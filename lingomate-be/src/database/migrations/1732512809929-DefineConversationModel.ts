import { MigrationInterface, QueryRunner } from "typeorm";

export class DefineConversationModel1732512809929
  implements MigrationInterface
{
  name = "DefineConversationModel1732512809929";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "conversation" DROP CONSTRAINT "FK_8e537fc6518a6b08d2c892cb02c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversation" DROP CONSTRAINT "FK_a8be5f043726a3fb3c841218e1d"`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_conversation" ("conversationId" uuid NOT NULL, "userId" integer NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3dad130078898b9325da36ab3db" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversation" DROP COLUMN "toConversationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversation" DROP COLUMN "fromConversationId"`,
    );
    await queryRunner.query(`ALTER TABLE "conversation" DROP COLUMN "to"`);
    await queryRunner.query(`ALTER TABLE "conversation" DROP COLUMN "from"`);
    await queryRunner.query(
      `CREATE TYPE "public"."conversation_conversationtype_enum" AS ENUM('PRIVATE', 'PUBLIC')`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversation" ADD "conversationType" "public"."conversation_conversationtype_enum" NOT NULL DEFAULT 'PRIVATE'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_conversation" ADD CONSTRAINT "FK_a3e5e26b62e895c0478fb104bec" FOREIGN KEY ("conversationId") REFERENCES "conversation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_conversation" ADD CONSTRAINT "FK_610e529db4ea61302bb83bf8d81" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_conversation" DROP CONSTRAINT "FK_610e529db4ea61302bb83bf8d81"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_conversation" DROP CONSTRAINT "FK_a3e5e26b62e895c0478fb104bec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversation" DROP COLUMN "conversationType"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."conversation_conversationtype_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversation" ADD "from" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversation" ADD "to" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversation" ADD "fromConversationId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversation" ADD "toConversationId" integer`,
    );
    await queryRunner.query(`DROP TABLE "user_conversation"`);
    await queryRunner.query(
      `ALTER TABLE "conversation" ADD CONSTRAINT "FK_a8be5f043726a3fb3c841218e1d" FOREIGN KEY ("toConversationId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversation" ADD CONSTRAINT "FK_8e537fc6518a6b08d2c892cb02c" FOREIGN KEY ("fromConversationId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
