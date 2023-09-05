import { MigrationInterface, QueryRunner } from 'typeorm';
import { ROOT_USERNAME } from '../common/app.constants';
import {
  ADMIN_ROLE_ID,
  MASTER_ROLE_ID,
  USER_ROLE_ID,
} from '../common/migration.role';
import { Role } from '../modules/user/entities';

export class Role1693896861446 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const roleRepo = queryRunner.connection.getRepository(Role);

    await roleRepo.insert([
      {
        id: MASTER_ROLE_ID,
        name: 'MASTER',
        createdBy: ROOT_USERNAME,
        updatedBy: ROOT_USERNAME,
      },
      {
        id: ADMIN_ROLE_ID,
        name: 'ADMIN',
        createdBy: ROOT_USERNAME,
        updatedBy: ROOT_USERNAME,
      },
      {
        id: USER_ROLE_ID,
        name: 'USER',
        createdBy: ROOT_USERNAME,
        updatedBy: ROOT_USERNAME,
      },
    ]);

    // await queryRunner.query(
    //   `INSERT INTO roles (id, name, createdBy, updatedBy)
    //             VALUES ('${MASTER_ROLE_ID}', 'MASTER', '${ROOT_USERNAME}', '${ROOT_USERNAME}'),
    //             ('${ADMIN_ROLE_ID}', 'ADMIN', '${ROOT_USERNAME}', '${ROOT_USERNAME}'),
    //             ('${USER_ROLE_ID}', 'USER', '${ROOT_USERNAME}', '${ROOT_USERNAME}');`,
    // );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM roles WHERE id IS NOT NULL;`);
  }
}
