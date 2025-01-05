import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateStatusPractice1735831417210 implements MigrationInterface {
    name = 'UpdateStatusPractice1735831417210'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "practice_exercise" ALTER COLUMN "status" SET DEFAULT 'ACTIVE'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "practice_exercise" ALTER COLUMN "status" SET DEFAULT 'IN_ACTIVE'`);
    }

}
