import { AuditEntity } from '../../../common/app.auditing-entity';
import { Role } from './role.entity';
import { Expose } from 'class-transformer';
import { IsUppercase } from 'class-validator';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToMany,
  // PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('permissions')
export class Permission extends AuditEntity {
  // @PrimaryGeneratedColumn({ type: 'bigint' })
  // id: string;

  @Column({ unique: true, length: 255 })
  @Expose()
  @IsUppercase()
  name: string;

  @Column()
  @Expose()
  description: string;

  @Column({ nullable: true })
  deletedAt?: Date;

  @Expose()
  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];

  @BeforeInsert()
  setCreateUpdateBy() {
    this.createdBy = this.id;
    this.updatedBy = this.id;
  }

  @BeforeUpdate()
  setUpdateBy() {
    this.updatedBy = this.id;
  }
}
