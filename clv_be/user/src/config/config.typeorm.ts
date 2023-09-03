import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { AuditingSubscriber } from 'typeorm-auditing';
// import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
// import { AuditEntity } from 'src/common/app.auditing-entity';
import {
  POSTGRES_DB,
  POSTGRES_DB_NAME,
  POSTGRES_HOST,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
  POSTGRES_USER,
} from 'src/common/db.postgres';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  @Inject(ConfigService)
  private readonly configService: ConfigService;

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get(POSTGRES_HOST),
      port: this.configService.get(POSTGRES_PORT),
      name: this.configService.get(POSTGRES_DB_NAME),
      username: this.configService.get(POSTGRES_USER),
      password: this.configService.get(POSTGRES_PASSWORD),
      database: this.configService.get(POSTGRES_DB),
      entities: ['dist/**/*.entity.js'],
      autoLoadEntities: true,
      // migrations: ['dist/migrations/*.js'],
      subscribers: [AuditingSubscriber],
      // namingStrategy: new SnakeNamingStrategy(),
      synchronize: true, // Set to false in production
      // logging: true, // Set to false in production
    };
  }
}
