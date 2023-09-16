import { Module, forwardRef } from '@nestjs/common';
// import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './controllers/user.controller';
import { Permission, Role, User } from './entities';
import {
  PermissionRepository,
  RoleRepository,
  UserRepository,
} from './repositories';
import { PermissionService, RoleService, UserService } from './services';
import { AuthModule } from '../auth/auth.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  KAFKA_BROKER_ID,
  KAFKA_NOTIFICATION_CLIENT_ID,
  KAFKA_NOTIFICATION_CONSUMER_GROUP_ID,
} from 'src/common/env';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([User, Role, Permission]),
    ClientsModule.register([
      {
        name: 'NOTIFICATION_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: KAFKA_NOTIFICATION_CLIENT_ID,
            brokers: [KAFKA_BROKER_ID],
          },
          consumer: { groupId: KAFKA_NOTIFICATION_CONSUMER_GROUP_ID },
        },
      },
    ]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    RoleService,
    RoleRepository,
    PermissionService,
    PermissionRepository,
  ],
  exports: [UserService, RoleService, UserRepository, RoleRepository],
})
export class UserModule {}
