import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt/jwt.strategy';

@Module({
  imports: [
    forwardRef(() => UserModule),
    // ClientsModule.register([
    //   {
    //     name: 'NOTI_SERVICE',
    //     transport: Transport.KAFKA,
    //     options: {
    //       client: {
    //         clientId: 'notification',
    //         brokers: ['localhost:9092'],
    //       },
    //       consumer: {
    //         groupId: 'noti-consumer',
    //       },
    //     },
    //   },
    // ]),
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: 'uthinkucanguessit',
        signOptions: {
          expiresIn: '3600s',
        },
      }),
      inject: [ConfigService],
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
