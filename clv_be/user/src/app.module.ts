import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { Permission, Role, User } from './modules/user/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from './config/config.default';
import { ConfigModule } from '@nestjs/config';

const entities = [User, Role, Permission];

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      username: 'hatv',
      password: '123456',
      database: 'postgres',
      port: 5432,
      entities,
      synchronize: true, // false
    }),
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
