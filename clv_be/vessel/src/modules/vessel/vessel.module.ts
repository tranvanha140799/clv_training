import { Module } from '@nestjs/common';
import { VesselController } from './controllers';
import { VesselService } from './services/';
import { ConfigModule } from '@nestjs/config';
import { VesselRepository } from './repositories';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vessel } from './entities';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Vessel])],
  controllers: [VesselController],
  providers: [VesselService, VesselRepository],
})
export class VesselModule {}
