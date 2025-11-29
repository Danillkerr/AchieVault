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
import { RoadmapModule } from 'src/features/roadmap/modules/roadmap.module';
import { RoadmapRecalcStep } from '../steps/roadmap-recalc.step';
import { FriendsSyncStep } from '../steps/friends-sync.step';
import { AchievementsSyncStep } from '../steps/achievements-sync.step';
import { GamesSyncStep } from '../steps/games-sync.step';

@Module({
  imports: [
    UserProfileModule,
    GameDataModule,
    SteamModule,
    IgdbModule,
    LeaderboardModule,
    RoadmapModule,
    BullModule.registerQueue(
      {
        name: 'cron-sync-queue',
        limiter: {
          max: 1,
          duration: 1100,
        },
        settings: {
          stalledInterval: 300000,
          retryProcessDelay: 60000,
          guardInterval: 300000,
          maxStalledCount: 1,
        },
      },
      {
        name: 'user-sync-queue',
        limiter: {
          max: 1,
          duration: 1100,
        },
        settings: {
          stalledInterval: 300000,
          guardInterval: 300000,
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

    GamesSyncStep,
    AchievementsSyncStep,
    FriendsSyncStep,
    RoadmapRecalcStep,
    {
      provide: 'SYNC_STEPS',
      useFactory: (
        gamesStep: GamesSyncStep,
        achievementsStep: AchievementsSyncStep,
        friendsStep: FriendsSyncStep,
        roadmapStep: RoadmapRecalcStep,
      ) => {
        return [gamesStep, achievementsStep, friendsStep, roadmapStep];
      },
      inject: [
        GamesSyncStep,
        AchievementsSyncStep,
        FriendsSyncStep,
        RoadmapRecalcStep,
      ],
    },
  ],
  exports: [BullModule, SyncService, GameEnrichmentService],
})
export class SyncModule {}
