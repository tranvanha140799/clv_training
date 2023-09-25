import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { NOTIFICATION_SERVICE, USER_SERVICE } from './common/app.constants';
import { providers } from './configs/config.provider';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { JwtStrategy } from './common/jwt/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import config from './configs/config.default';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.register([
      {
        name: USER_SERVICE,
        transport: Transport.TCP,
        options: {
          host: process.env.APP_DOMAIN,
          port: +process.env.USER_PORT,
        },
      },
      {
        name: NOTIFICATION_SERVICE,
        transport: Transport.TCP,
        options: {
          host: process.env.APP_DOMAIN,
          port: +process.env.NOTIFICATION_PORT,
        },
      },
    ]),
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXP_H') },
      }),
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AppController, AuthController, UserController],
  providers: [AppService, AuthService, UserService, JwtStrategy, ...providers],
})
export class AppModule {}
