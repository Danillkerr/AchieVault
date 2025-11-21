import { Module } from '@nestjs/common';
import { UserProfileModule } from '../../users/user-profile.module';
import { GameDataModule } from '../../game/game-data.module';
import { SyncController } from '../controllers/sync.controller';
import { SyncService } from '../services/sync.service';
import { IgdbModule } from '../../api/igdb/modules/igdb.module';
import { SteamModule } from 'src/features/api/steam/modules/steam.module';
import { GameEnrichmentService } from '../services/game-enrichment.service';
import { BullModule } from '@nestjs/bull/dist/bull.module';
import { CronSyncProcessor } from '../processors/cron-sync.processor';
import { UserSyncProcessor } from '../processors/user-sync.processor';
import { LeaderboardModule } from 'src/features/leaderboard/modules/leaderboard.module';

@Module({
  imports: [
    UserProfileModule,
    GameDataModule,
    SteamModule,
    IgdbModule,
    LeaderboardModule,
    BullModule.registerQueue(
      {
        name: 'cron-sync-queue',
        limiter: {
          max: 1,
          duration: 1100,
        },
      },
      {
        name: 'user-sync-queue',
        limiter: {
          max: 1,
          duration: 1100,
        },
      },
    ),
  ],
  controllers: [SyncController],
  providers: [
    SyncService,
    GameEnrichmentService,
    CronSyncProcessor,
    UserSyncProcessor,
  ],
  exports: [BullModule, SyncService, GameEnrichmentService],
})
export class SyncModule {}
