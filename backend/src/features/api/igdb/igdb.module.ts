import { Module } from '@nestjs/common';
import { IgdbService } from './igdb.service';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [IgdbService],
  exports: [IgdbService],
})
export class IgdbModule {}
