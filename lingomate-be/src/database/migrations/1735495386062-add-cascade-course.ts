import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCascadeCourse1735495386062 implements MigrationInterface {
  name = "AddCascadeCourse1735495386062";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "course" DROP CONSTRAINT "FK_08e5a6e400775ffc0697e0f0577"`,
    );
    await queryRunner.query(
      `ALTER TABLE "course" ADD CONSTRAINT "FK_08e5a6e400775ffc0697e0f0577" FOREIGN KEY ("photoId") REFERENCES "file"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "course" DROP CONSTRAINT "FK_08e5a6e400775ffc0697e0f0577"`,
    );
    await queryRunner.query(
      `ALTER TABLE "course" ADD CONSTRAINT "FK_08e5a6e400775ffc0697e0f0577" FOREIGN KEY ("photoId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
