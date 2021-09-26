import {MigrationInterface, QueryRunner} from "typeorm";

export class addFlightEntity1632507089120 implements MigrationInterface {
    name = 'addFlightEntity1632507089120'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "flight" ("id" SERIAL NOT NULL, "airline" character varying NOT NULL, "airportFrom" character varying NOT NULL, "airportTo" character varying NOT NULL, "code" character varying NOT NULL, "departure" TIMESTAMP NOT NULL, "arrival" TIMESTAMP NOT NULL, "status" character varying NOT NULL, CONSTRAINT "PK_bf571ce6731cf071fc51b94df03" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "flight"`);
    }

}
