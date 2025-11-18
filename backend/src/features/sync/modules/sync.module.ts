import { Module } from '@nestjs/common';
import { UserProfileModule } from '../../users/user-profile.module';
import { GameDataModule } from '../../game/game-data.module';
import { SyncController } from '../controllers/sync.controller';
import { SyncService } from '../service/sync.service';
import { IgdbModule } from '../../api/igdb/modules/igdb.module';
import { SteamModule } from 'src/features/api/steam/modules/steam.module';
import { GameEnrichmentService } from '../service/game-enrichment.service';

@Module({
  imports: [UserProfileModule, GameDataModule, SteamModule, IgdbModule],
  controllers: [SyncController],
  providers: [SyncService, GameEnrichmentService],
})
export class SyncModule {}
