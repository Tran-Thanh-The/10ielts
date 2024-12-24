import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGraded1735011821203 implements MigrationInterface {
    name = 'AddGraded1735011821203'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoice" DROP CONSTRAINT "FK_f8e849201da83b87f78c7497dde"`);
        await queryRunner.query(`ALTER TABLE "answer_history" ADD "writingAnswer" text`);
        await queryRunner.query(`ALTER TABLE "answer_history" ADD "teacherScore" numeric(5,2)`);
        await queryRunner.query(`ALTER TABLE "answer_history" ADD "teacherFeedback" text`);
        await queryRunner.query(`ALTER TABLE "answer_history" ALTER COLUMN "status" SET DEFAULT 'ACTIVE'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answer_history" ALTER COLUMN "status" SET DEFAULT 'IN_ACTIVE'`);
        await queryRunner.query(`ALTER TABLE "answer_history" DROP COLUMN "teacherFeedback"`);
        await queryRunner.query(`ALTER TABLE "answer_history" DROP COLUMN "teacherScore"`);
        await queryRunner.query(`ALTER TABLE "answer_history" DROP COLUMN "writingAnswer"`);
        await queryRunner.query(`ALTER TABLE "invoice" ADD CONSTRAINT "FK_f8e849201da83b87f78c7497dde" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
