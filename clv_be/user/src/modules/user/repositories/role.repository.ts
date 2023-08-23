import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractRepository } from '../../../common/app.abstract.repository';
import { Repository } from 'typeorm';
import { Role } from '../entities';

@Injectable()
export class RoleRepository extends AbstractRepository<Role> {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {
    super(roleRepository);
  }
}
