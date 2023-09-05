import {
  POSTGRES_DB,
  POSTGRES_HOST,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
  POSTGRES_USER,
} from '../common/db.postgres';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
config();
const configService = new ConfigService();

console.log(
  configService.get(POSTGRES_HOST),
  configService.get(POSTGRES_PORT),
  configService.get(POSTGRES_USER),
  configService.get(POSTGRES_PASSWORD),
  configService.get(POSTGRES_DB),
);

export default new DataSource({
  type: 'postgres',
  host: configService.get(POSTGRES_HOST),
  port: configService.get(POSTGRES_PORT),
  username: configService.get(POSTGRES_USER),
  password: configService.get(POSTGRES_PASSWORD),
  database: configService.get(POSTGRES_DB),
  logging: true,
  migrationsTableName: '_migrations',
  migrations: ['.src/migrations/*.ts'],
});
