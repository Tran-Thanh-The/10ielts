import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTableAnswer1730109625759 implements MigrationInterface {
    name = 'UpdateTableAnswer1730109625759'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answer" ALTER COLUMN "isCorrect" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "answer" ALTER COLUMN "status" SET DEFAULT 'IN_ACTIVE'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answer" ALTER COLUMN "status" SET DEFAULT 'ACTIVE'`);
        await queryRunner.query(`ALTER TABLE "answer" ALTER COLUMN "isCorrect" DROP DEFAULT`);
    }

}
