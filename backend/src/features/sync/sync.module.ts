import { Module } from '@nestjs/common';
import { UserModule } from '../users/user.module';
import { HttpModule } from '@nestjs/axios';
import { SyncController } from './sync.controller';
import { SyncService } from './sync.service';
import { GameModule } from '../game/game.module';
import { SteamModule } from '../api/steam/steam.module';
import { IgdbModule } from '../api/igdb/igdb.module';

@Module({
  imports: [UserModule, HttpModule, GameModule, SteamModule, IgdbModule],
  controllers: [SyncController],
  providers: [SyncService],
})
export class SyncModule {}
