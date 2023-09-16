import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from './config/config.default';
import typeorm from './config/config.typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { providers } from './config/config.provider';
import { CacheModule } from '@nestjs/cache-manager';
import { REDIS_PORT } from './common/env';

@Module({
  imports: [
    AuthModule,
    UserModule,
    CacheModule.register({
      isGlobal: true,
      host: 'localhost',
      port: REDIS_PORT,
    }),
    ConfigModule.forRoot({ isGlobal: true, load: [typeorm, config] }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
  ],
  controllers: [AppController],
  providers: [AppService, ...providers],
})
export class AppModule {}
