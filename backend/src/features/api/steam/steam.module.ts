import { Module } from '@nestjs/common';
import { SteamService } from './steam.service';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [SteamService],
  exports: [SteamService],
})
export class SteamModule {}
