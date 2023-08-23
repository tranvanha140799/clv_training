import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api.controller.gateway';
import { ApiGatewayService } from './api.service.gateway';

@Module({
  imports: [],
  controllers: [ApiGatewayController],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule {}
