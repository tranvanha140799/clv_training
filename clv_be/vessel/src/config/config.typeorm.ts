import { registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { AuditingSubscriber } from 'typeorm-auditing';
import { AuditEntity } from 'src/common/app.auditing-entity';
import { join } from 'path';
// import { VesselEntity } from 'src/modules/vessel/entities';
import {
  POSTGRES_DB,
  POSTGRES_DB_NAME,
  POSTGRES_HOST,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
  POSTGRES_USER,
} from 'src/common/env';

const config = {
  type: 'postgres',
  host: POSTGRES_HOST,
  port: POSTGRES_PORT,
  name: POSTGRES_DB_NAME,
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB,
  entities: [AuditEntity, join(__dirname + '/../**/*.entity.{js,ts}')],
  // entities: [AuditEntity, VesselEntity],
  autoLoadEntities: true,
  migrations: [join(__dirname, '/../migrations/*.{js,ts}')], // Haven't checked if the related route is correct
  subscribers: [AuditingSubscriber],
  // logging: true, // Logging query to console
  synchronize: false,
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
