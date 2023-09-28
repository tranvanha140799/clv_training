import {
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  forwardRef,
} from '@nestjs/common';
import { VesselRepository } from '../repositories';
import { Vessel } from '../entities';
import { RpcException } from '@nestjs/microservices';
import { VesselDTO } from '../dto/vessel.new-vessel.dto';

@Injectable()
export class VesselService {
  constructor(
    @Inject(forwardRef(() => VesselRepository))
    private readonly vesselRepository: VesselRepository,
  ) {}
  private readonly logger = new Logger('VesselService');

  async getAllVessels(): Promise<Vessel[]> {
    try {
      const vessels = await this.vesselRepository.find({
        order: { creDt: 'ASC' },
      });
      if (vessels) return vessels;
      else
        throw new RpcException({
          status: HttpStatus.NOT_FOUND,
          message: 'No vessel found!',
        });
    } catch (error) {
      this.logger.error(error.message);
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: error.message,
      });
    }
  }

  async getVesselByCode(vesselCode: string): Promise<Vessel> {
    try {
      const vessel =
        await this.vesselRepository.findOneByVesselCode(vesselCode);

      if (vessel) return vessel;
      else
        throw new RpcException({
          status: HttpStatus.NOT_FOUND,
          message: 'No vessel found with provided code!',
        });
    } catch (error) {
      this.logger.error(error.message);
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: error.message,
      });
    }
  }

  async addVessel(vesselDto: VesselDTO): Promise<Vessel> {
    try {
      const vsl = await this.vesselRepository.findOneByVesselCode(
        vesselDto.vslCd,
      );
      // Check if vessel code already exists
      if (vsl)
        throw new RpcException({
          status: HttpStatus.CONFLICT,
          message: 'Vessel code already exists!',
        });

      const newVessel = this.vesselRepository.create(vesselDto);
      const vessel = await this.vesselRepository.save(newVessel);

      return vessel;
    } catch (error) {
      this.logger.error(error.message);
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }

  async editVessel(editVesselDto: VesselDTO) {
    try {
      const vessel = await this.searchVesselByCondition({
        where: { vslCd: editVesselDto.vslCd },
      });
      if (vessel) {
        await this.vesselRepository
          .createQueryBuilder()
          .update(Vessel)
          .set({
            // TODO: More details update...
            ...editVesselDto,
          })
          .where('vslCd = :vslCd', { vslCd: vessel.vslCd })
          .execute();

        return { status: HttpStatus.OK, message: 'Done!' };
      } else {
        throw new RpcException({
          status: HttpStatus.NOT_FOUND,
          message: 'Vessel not found!',
        });
      }
    } catch (error) {
      this.logger.error(error.message);
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }

  async deleteVessel(vesselCode: string) {
    try {
      await this.vesselRepository
        .createQueryBuilder()
        .delete()
        .where('vslCd = :vslCd', { vslCd: vesselCode })
        .execute();

      return { status: HttpStatus.OK, message: 'Deleted!' };
    } catch (error) {
      this.logger.error(error.message);
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }

  async searchVesselByCondition(condition: any): Promise<Vessel> {
    try {
      const vessel = await this.vesselRepository.findOne(condition);
      return vessel;
    } catch (error) {
      this.logger.error(error.message);
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: error.message,
      });
    }
  }
}
