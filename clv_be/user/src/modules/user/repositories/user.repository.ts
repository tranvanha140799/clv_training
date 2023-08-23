import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractRepository } from '../../../common/app.abstract.repository';
import { Repository } from 'typeorm';
import { User } from '../entities';

@Injectable()
export class UserRepository extends AbstractRepository<User> {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super(userRepository);
  }
}
