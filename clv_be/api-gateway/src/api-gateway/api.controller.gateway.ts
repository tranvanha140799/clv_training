import { All, Controller, Req } from '@nestjs/common';
import { Request } from 'express';
import { ApiGatewayService } from './api.service.gateway';

@Controller()
export class ApiGatewayController {
  constructor(private readonly gwService: ApiGatewayService) {}

  @All('/:serviceName/:path')
  async onIncomingRequest(@Req() request: Request): Promise<any> {
    return await this.gwService.redirectRequest(request);
  }
}
