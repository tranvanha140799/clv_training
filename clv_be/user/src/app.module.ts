import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
// import { Permission, Role, User } from './modules/user/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from './config/config.default';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmConfigService } from './config/config.typeorm';

// const entities = [User, Role, Permission];

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: 'localhost',
    //   port: 5432,
    //   username: 'hatv',
    //   password: '123456',
    //   database: 'postgres',
    //   entities,
    //   synchronize: true, // false
    // }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useClass: TypeOrmConfigService,
    }),
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
