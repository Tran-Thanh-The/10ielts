import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAudioAnswer1735018655652 implements MigrationInterface {
    name = 'AddAudioAnswer1735018655652'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answer_history" ADD "audioAnswerId" uuid`);
        await queryRunner.query(`ALTER TABLE "answer_history" ADD CONSTRAINT "UQ_f4a42c24eca09833258b9a846cb" UNIQUE ("audioAnswerId")`);
        await queryRunner.query(`ALTER TABLE "answer_history" ADD CONSTRAINT "FK_f4a42c24eca09833258b9a846cb" FOREIGN KEY ("audioAnswerId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answer_history" DROP CONSTRAINT "FK_f4a42c24eca09833258b9a846cb"`);
        await queryRunner.query(`ALTER TABLE "answer_history" DROP CONSTRAINT "UQ_f4a42c24eca09833258b9a846cb"`);
        await queryRunner.query(`ALTER TABLE "answer_history" DROP COLUMN "audioAnswerId"`);
    }

}
