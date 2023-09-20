import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt/jwt.strategy';
import { JWT, JWT_EXP_H, JWT_SECRET } from 'src/common/app.jwt';
import { GoogleStrategy } from './strategies/google.strategy';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  KAFKA_BROKER_ID,
  KAFKA_NOTIFICATION_CLIENT_ID,
  KAFKA_NOTIFICATION_CONSUMER_GROUP_ID,
} from 'src/common/env';

@Module({
  imports: [
    ConfigModule,
    UserModule,
    ClientsModule.register([
      {
        name: 'NOTIFICATION_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: KAFKA_NOTIFICATION_CLIENT_ID,
            brokers: [KAFKA_BROKER_ID],
          },
          consumer: {
            groupId: KAFKA_NOTIFICATION_CONSUMER_GROUP_ID,
          },
        },
      },
    ]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>(JWT_SECRET),
        signOptions: { expiresIn: configService.get<string>(JWT_EXP_H) },
      }),
    }),
    PassportModule.register({ defaultStrategy: JWT }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GoogleStrategy],
  exports: [AuthService],
})
export class AuthModule {}
