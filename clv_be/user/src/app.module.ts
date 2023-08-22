import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { Permission, Role, User } from './modules/user/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

const entities = [User, Role, Permission];

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      username: 'hatv',
      password: '123456',
      database: 'postgres',
      port: 5432,
      entities,
      synchronize: true,
    }),
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
