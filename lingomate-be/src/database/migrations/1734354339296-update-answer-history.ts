import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateAnswerHistory1734354339296 implements MigrationInterface {
    name = 'UpdateAnswerHistory1734354339296'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answer_history" ADD "answers" jsonb`);
        const userAnswerTableExists = await queryRunner.query(`
            SELECT table_name
            FROM information_schema.tables
            WHERE table_name = 'user_answer'
        `);

        if (userAnswerTableExists.length > 0) {
            await queryRunner.query(`DROP TABLE "user_answer"`);
        }

        await queryRunner.query(`ALTER TABLE "question" ALTER COLUMN "fileType" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question" ALTER COLUMN "fileType" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "answer_history" DROP COLUMN "answers"`);
    }

}
