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

@Module({
  imports: [
    forwardRef(() => AuthModule),
    // AuthModule,
    TypeOrmModule.forFeature([User, Role, Permission]),
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
