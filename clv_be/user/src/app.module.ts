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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [typeorm, config] }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, ...providers],
})
export class AppModule {}
