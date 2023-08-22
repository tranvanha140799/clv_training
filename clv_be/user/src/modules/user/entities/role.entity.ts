import { AuditEntity } from '../../../common/app.auditing-entity';
import { Permission } from './permission.entity';
import { User } from './user.entity';
import { Expose } from 'class-transformer';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('roles')
export class Role extends AuditEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: string;

  @Column({ unique: true, length: 255 })
  @Expose()
  name: string;

  @Column({ nullable: true })
  deletedAt?: Date;

  @ManyToMany(() => Permission, (permission) => permission.roles, {
    cascade: true,
  })
  @JoinTable({
    name: 'role_permissions',
    joinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'permission_id',
      referencedColumnName: 'id',
    },
  })
  @Expose()
  permissions: Permission[];

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}
