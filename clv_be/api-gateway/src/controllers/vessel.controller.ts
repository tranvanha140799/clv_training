import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { VesselService } from 'src/services/vessel.service';
import { VesselDTO } from '../dto';

@Controller('vessels')
export class VesselController {
  constructor(private readonly vesselService: VesselService) {}
  private logger = new Logger('API GATEWAY');

  @Get('list')
  getListVessels() {
    this.logger.log('is redirecting request to VESSEL_SERVICE');
    return this.vesselService.getListVessels();
  }

  @Get(':vesselCode')
  getVesselByCode(@Param('vesselCode') vslCd: string) {
    this.logger.log('is redirecting request to VESSEL_SERVICE');
    return this.vesselService.getVesselByCode(vslCd);
  }

  @Post('add')
  addVessel(@Body() vesselDto: VesselDTO) {
    this.logger.log('is redirecting request to VESSEL_SERVICE');
    return this.vesselService.addVessel(vesselDto);
  }

  @Put('edit')
  editVessel(@Body() vesselDto: VesselDTO) {
    this.logger.log('is redirecting request to VESSEL_SERVICE');
    return this.vesselService.editVessel(vesselDto);
  }

  @Delete(':vesselCode')
  deleteVessel(@Param('vesselCode') vesselCode: string) {
    this.logger.log('is redirecting request to VESSEL_SERVICE');
    return this.vesselService.deleteVessel(vesselCode);
  }
}
