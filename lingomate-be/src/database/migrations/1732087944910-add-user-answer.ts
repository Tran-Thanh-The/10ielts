import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserAnswer1732087944910 implements MigrationInterface {
    name = 'AddUserAnswer1732087944910'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_answer_status_enum" AS ENUM('ACTIVE', 'IN_ACTIVE')`);
        await queryRunner.query(`CREATE TABLE "user_answer" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "answerPick" character varying, "status" "public"."user_answer_status_enum" NOT NULL DEFAULT 'IN_ACTIVE', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "answerHistoryId" uuid, "questionId" uuid, CONSTRAINT "PK_37b32f666e59572775b1b020fb5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "answer" ADD "createdBy" integer`);
        await queryRunner.query(`ALTER TABLE "answer" ADD "updatedBy" integer`);
        await queryRunner.query(`ALTER TABLE "practice_exercise" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "practice_exercise" ADD "createdBy" integer`);
        await queryRunner.query(`ALTER TABLE "practice_exercise" ADD "updatedBy" integer`);
        await queryRunner.query(`ALTER TABLE "answer_history" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "question" ADD "createdBy" integer`);
        await queryRunner.query(`ALTER TABLE "question" ADD "updatedBy" integer`);
        await queryRunner.query(`ALTER TABLE "user_answer" ADD CONSTRAINT "FK_323534f396201e7055acf950644" FOREIGN KEY ("answerHistoryId") REFERENCES "answer_history"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_answer" ADD CONSTRAINT "FK_39bb21c637a8c11e2f3abd527e6" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "answer_history" ADD CONSTRAINT "FK_d92a9caf31d450b9f6e23629944" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answer_history" DROP CONSTRAINT "FK_d92a9caf31d450b9f6e23629944"`);
        await queryRunner.query(`ALTER TABLE "user_answer" DROP CONSTRAINT "FK_39bb21c637a8c11e2f3abd527e6"`);
        await queryRunner.query(`ALTER TABLE "user_answer" DROP CONSTRAINT "FK_323534f396201e7055acf950644"`);
        await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "updatedBy"`);
        await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "createdBy"`);
        await queryRunner.query(`ALTER TABLE "answer_history" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "practice_exercise" DROP COLUMN "updatedBy"`);
        await queryRunner.query(`ALTER TABLE "practice_exercise" DROP COLUMN "createdBy"`);
        await queryRunner.query(`ALTER TABLE "practice_exercise" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "answer" DROP COLUMN "updatedBy"`);
        await queryRunner.query(`ALTER TABLE "answer" DROP COLUMN "createdBy"`);
        await queryRunner.query(`DROP TABLE "user_answer"`);
        await queryRunner.query(`DROP TYPE "public"."user_answer_status_enum"`);
    }

}
