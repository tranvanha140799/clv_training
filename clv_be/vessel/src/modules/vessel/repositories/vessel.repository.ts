import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractRepository } from '../../../common/app.abstract.repository';
import { Repository } from 'typeorm';
import { Vessel } from '../entities';

@Injectable()
export class VesselRepository extends AbstractRepository<Vessel> {
  constructor(
    @InjectRepository(Vessel)
    private vesselRepository: Repository<Vessel>,
  ) {
    super(vesselRepository);
  }

  findOneByVesselCode(vesselCode: string): Promise<Vessel> {
    return this.vesselRepository.findOneBy({ vslCd: vesselCode } as any);
  }
}
