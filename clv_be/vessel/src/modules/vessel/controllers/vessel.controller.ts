import { Controller, UseFilters } from '@nestjs/common';
import { VesselService } from '../services';
import { Vessel } from '../entities';
import { MessagePattern, Transport } from '@nestjs/microservices';
import { RPCExceptionFilter } from '../../../utils';
import {
  ADD_VESSEL,
  DELETE_VESSEL,
  EDIT_VESSEL,
  GET_ALL_VESSELS,
  GET_VESSEL_BY_ID,
} from 'src/common/app.message-pattern';
import { VesselDTO } from '../dto/vessel.new-vessel.dto';

@Controller('vessel')
@UseFilters(new RPCExceptionFilter())
export class VesselController {
  constructor(private readonly vesselService: VesselService) {}

  @MessagePattern({ cmd: GET_ALL_VESSELS }, Transport.TCP)
  getListVessels(): Promise<Vessel[]> {
    return this.vesselService.getAllVessels();
  }

  @MessagePattern({ cmd: GET_VESSEL_BY_ID }, Transport.TCP)
  getVesselByCode(vesselCode: string): Promise<Vessel> {
    return this.vesselService.getVesselByCode(vesselCode);
  }

  @MessagePattern({ cmd: ADD_VESSEL }, Transport.TCP)
  addVessel(vesselDto: VesselDTO): Promise<Vessel> {
    return this.vesselService.addVessel(vesselDto);
  }

  @MessagePattern({ cmd: EDIT_VESSEL }, Transport.TCP)
  editVessel(vesselDto: VesselDTO) {
    return this.vesselService.editVessel(vesselDto);
  }

  @MessagePattern({ cmd: DELETE_VESSEL }, Transport.TCP)
  deleteVessel(vesselCode: string) {
    return this.vesselService.deleteVessel(vesselCode);
  }
}
