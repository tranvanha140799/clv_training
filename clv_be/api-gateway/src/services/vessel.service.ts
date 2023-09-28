import { Inject, Injectable } from '@nestjs/common';
import { firstValueFrom, from, map } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { VESSEL_SERVICE } from 'src/common/app.constants';
import { catchRpcError } from '../utils';
import {
  ADD_VESSEL,
  DELETE_VESSEL,
  EDIT_VESSEL,
  GET_ALL_VESSELS,
  GET_VESSEL_BY_ID,
} from 'src/common/app.message-pattern';
import { VesselDTO } from 'src/dto';

@Injectable()
export class VesselService {
  constructor(
    @Inject(VESSEL_SERVICE)
    private readonly vesselService: ClientProxy
  ) {}

  getListVessels() {
    const pattern = { cmd: GET_ALL_VESSELS };
    return firstValueFrom(
      from(
        this.vesselService.send<string>(pattern, {}).pipe(
          map((res) => {
            catchRpcError(res);

            return res;
          })
        )
      )
    );
  }

  getVesselByCode(code: string) {
    const pattern = { cmd: GET_VESSEL_BY_ID };
    return firstValueFrom(
      from(
        this.vesselService.send<string>(pattern, code).pipe(
          map((res) => {
            catchRpcError(res);

            return res;
          })
        )
      )
    );
  }

  addVessel(vesselDto: VesselDTO) {
    const pattern = { cmd: ADD_VESSEL };
    return firstValueFrom(
      from(
        this.vesselService.send<string>(pattern, vesselDto).pipe(
          map((res) => {
            catchRpcError(res);

            return res;
          })
        )
      )
    );
  }

  editVessel(vesselDto: VesselDTO) {
    const pattern = { cmd: EDIT_VESSEL };
    return firstValueFrom(
      from(
        this.vesselService.send<string>(pattern, vesselDto).pipe(
          map((res) => {
            catchRpcError(res);

            return res;
          })
        )
      )
    );
  }

  deleteVessel(vesselCode: string) {
    const pattern = { cmd: DELETE_VESSEL };
    return firstValueFrom(
      from(
        this.vesselService.send<string>(pattern, vesselCode).pipe(
          map((res) => {
            catchRpcError(res);

            return res;
          })
        )
      )
    );
  }
}
