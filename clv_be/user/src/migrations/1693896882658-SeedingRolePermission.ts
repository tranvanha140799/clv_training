import { MigrationInterface, QueryRunner } from 'typeorm';
import { MASTER_ROLE_ID } from '../common/migration.role';
import {
  ACTIVATE_USER_ID,
  ADD_PERMISSION_ID,
  GET_ALL_USER_ID,
} from '../common/migration.permission';

export class SeedingRolePermission1693896882658 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO role_permissions (role_id, permission_id)
                VALUES ('${MASTER_ROLE_ID}', '${ACTIVATE_USER_ID}'),
                ('${MASTER_ROLE_ID}', '${GET_ALL_USER_ID}'),
                ('${MASTER_ROLE_ID}', '${ADD_PERMISSION_ID}');`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM role_permissions WHERE id IS NOT NULL;`,
    );
  }
}
