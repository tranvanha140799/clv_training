import { MigrationInterface, QueryRunner } from 'typeorm';
import { ROOT_USERNAME } from '../common/app.constants';
import {
  ACTIVATE_USER,
  ACTIVATE_USER_DESCRIPTION,
  ACTIVATE_USER_ID,
  ADD_PERMISSION,
  ADD_PERMISSION_DESCRIPTION,
  ADD_PERMISSION_ID,
  GET_ALL_USER,
  GET_ALL_USER_DESCRIPTION,
  GET_ALL_USER_ID,
} from '../common/migration.permission';
import { Permission } from '../modules/user/entities';

export class Permission1693896829151 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const permissionRepo = queryRunner.connection.getRepository(Permission);

    await permissionRepo.insert([
      {
        id: ACTIVATE_USER_ID,
        name: ACTIVATE_USER,
        description: ACTIVATE_USER_DESCRIPTION,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: ROOT_USERNAME,
        updatedBy: ROOT_USERNAME,
      },
      {
        id: GET_ALL_USER_ID,
        name: GET_ALL_USER,
        description: GET_ALL_USER_DESCRIPTION,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: ROOT_USERNAME,
        updatedBy: ROOT_USERNAME,
      },
      {
        id: ADD_PERMISSION_ID,
        name: ADD_PERMISSION,
        description: ADD_PERMISSION_DESCRIPTION,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: ROOT_USERNAME,
        updatedBy: ROOT_USERNAME,
      },
    ]);
    // await queryRunner.query(
    //   `INSERT INTO permissions (id, name, description, createdAt, updatedAt, createdBy, updatedBy)
    //             VALUES ('${ACTIVATE_USER_ID}', '${ACTIVATE_USER}', '${ACTIVATE_USER_DESCRIPTION}', now(), now(), '${ROOT_USERNAME}', '${ROOT_USERNAME}'),
    //             ('${GET_ALL_USER_ID}', '${GET_ALL_USER}', '${GET_ALL_USER_DESCRIPTION}', now(), now(), '${ROOT_USERNAME}', '${ROOT_USERNAME}'),
    //              ('${ADD_PERMISSION_ID}', '${ADD_PERMISSION}', '${ADD_PERMISSION_DESCRIPTION}', now(), now(), '${ROOT_USERNAME}', '${ROOT_USERNAME}');`,
    // );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM permissions WHERE id IS NOT NULL;`);
  }
}
