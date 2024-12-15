import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserCreatedBy1732093559723 implements MigrationInterface {
  name = "UpdateUserCreatedBy1732093559723";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "createdBy" integer`);
    await queryRunner.query(`ALTER TABLE "user" ADD "updatedBy" integer`);
    await queryRunner.query(`ALTER TABLE "user" ADD "deletedBy" integer`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "deletedBy"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updatedBy"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdBy"`);
  }
}
