import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VesselModule } from './modules/vessel/vessel.module';
import { providers } from './config/config.provider';
import typeorm from './config/config.typeorm';
import config from './config/config.default';

@Module({
  imports: [
    VesselModule,
    ConfigModule.forRoot({ isGlobal: true, load: [typeorm, config] }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
  ],
  controllers: [AppController],
  providers: [AppService, ...providers],
})
export class AppModule {}
