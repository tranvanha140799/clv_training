import { MigrationInterface, QueryRunner } from 'typeorm';
import { MASTER_EMAIL, MASTER_ID } from '../common/migration.role';
import { User } from '../modules/user/entities';

export class User1693896869713 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const userRepo = queryRunner.connection.getRepository(User);

    await userRepo.insert([
      {
        id: MASTER_ID,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: MASTER_ID,
        updatedBy: MASTER_ID,
        email: MASTER_EMAIL,
        password:
          '$2b$10$woa1FHSufT2qs.NU.XCB2OD0jg3NVkKwMekF6UG74iA8qFXGtp/xi',
        isPending: false,
        isDisable: false,
        firstName: 'Ha',
        lastName: 'Tran',
        globalId: null,
        officeCode: null,
        country: null,
      },
    ]);

    // await queryRunner.query(
    //   `INSERT INTO users (
    //             id, createdAt, updatedAt, createdBy, updatedBy,
    //             email, password, is_pending, is_disable,
    //             first_name, last_name, global_id, office_code, country
    //         ) VALUES (
    //         '${MASTER_ID}', now(), now(), '${MASTER_ID}', '${MASTER_ID}',
    //         '${MASTER_EMAIL}', '$2b$10$woa1FHSufT2qs.NU.XCB2OD0jg3NVkKwMekF6UG74iA8qFXGtp/xi',
    //         false, false, 'Ha', 'Tran', NULL, NULL, NULL
    //         );`,
    // );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM users WHERE email = '${MASTER_EMAIL}';`,
    );
  }
}
