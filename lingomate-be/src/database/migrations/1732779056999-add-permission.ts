import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPermission1732779056999 implements MigrationInterface {
    name = 'AddPermission1732779056999'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role" ADD "permissions" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "permissions"`);
    }

}
