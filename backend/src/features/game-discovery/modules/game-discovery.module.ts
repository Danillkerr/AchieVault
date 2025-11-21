import { Module } from '@nestjs/common';
import { GameDiscoveryService } from '../services/game-discovery.service';
import { GameDiscoveryController } from '../controllers/game-discovery.controller';
import { SyncModule } from 'src/features/sync/modules/sync.module';
import { SteamModule } from 'src/features/api/steam/modules/steam.module';
import { GameDataModule } from 'src/features/game/game-data.module';

@Module({
  imports: [SteamModule, SyncModule, GameDataModule],
  providers: [GameDiscoveryService],
  controllers: [GameDiscoveryController],
})
export class GameDiscoveryModule {}
