import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPermission1734275629781 implements MigrationInterface {
  name = "AddPermission1734275629781";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Xóa bảng user_question nếu tồn tại
    await queryRunner.query(`DROP TABLE IF EXISTS "user_question"`);

    await queryRunner.query(`ALTER TABLE "role" ADD "permissions" text`);
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_c28e52f758e7bbc53828db92194"`,
    );
    await queryRunner.query(
      `CREATE SEQUENCE IF NOT EXISTS "role_id_seq" OWNED BY "role"."id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" ALTER COLUMN "id" SET DEFAULT nextval('"role_id_seq"')`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_c28e52f758e7bbc53828db92194"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(`DROP SEQUENCE "role_id_seq"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "permissions"`);
  }
}
