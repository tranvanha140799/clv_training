import { registerAs } from '@nestjs/config';
import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { AuditingSubscriber } from 'typeorm-auditing';
import { AuditEntity } from 'src/common/app.auditing-entity';

const config = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  name: process.env.POSTGRES_DB_NAME,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [AuditEntity, join(__dirname + '/../**/*.entity.{js,ts}')],
  autoLoadEntities: true,
  migrations: [join(__dirname, '/../migrations/*.{js,ts}')], // Haven't checked if the related route is correct
  subscribers: [AuditingSubscriber],
  // logging: true, // Logging query to console
  synchronize: false,
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
