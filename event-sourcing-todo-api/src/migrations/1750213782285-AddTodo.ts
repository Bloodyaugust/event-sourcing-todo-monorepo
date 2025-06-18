import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTodo1750213782285 implements MigrationInterface {
  name = 'AddTodo1750213782285';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "todo" ("id" character varying NOT NULL, "name" character varying NOT NULL, "done" boolean NOT NULL, "createdAt" character varying NOT NULL, "updatedAt" character varying NOT NULL, CONSTRAINT "PK_d429b7114371f6a35c5cb4776a7" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "todo"`);
  }
}
