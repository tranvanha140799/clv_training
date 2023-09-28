import { InjectRepository } from '@nestjs/typeorm';
import { Entity, ObjectLiteral, Repository } from 'typeorm';

export class AbstractRepository<T extends ObjectLiteral> extends Repository<T> {
  constructor(
    @InjectRepository(Entity)
    private readonly entity: Repository<T>,
  ) {
    super(entity.target, entity.manager, entity.queryRunner);
  }

  async findOneById(id: string): Promise<T | null> {
    return await this.entity.findOneBy({ id: id } as any);
  }

  async findByCondition(filterCondition: any): Promise<T | null> {
    return await this.entity.findOne({ where: filterCondition });
  }

  async findWithRelations(relations: any): Promise<T[]> {
    return await this.entity.find(relations);
  }

  async findAll(): Promise<T[]> {
    return await this.entity.find();
  }
}
