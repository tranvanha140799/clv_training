import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiGatewayModule } from './api-gateway/api.gateway.module';

@Module({
  imports: [ApiGatewayModule],
  providers: [AppService],
})
export class AppModule {}
