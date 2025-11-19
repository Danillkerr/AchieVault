import {
  OnQueueActive,
  OnQueueDrained,
  Process,
  Processor,
} from '@nestjs/bull';
import type { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { SyncService } from '../services/sync.service';
import { UsersService } from '../../users/services/users.service';
import { LeaderboardService } from '../../leaderboard/services/leaderboard.service';

@Processor('cron-sync-queue')
export class CronSyncProcessor {
  private readonly logger = new Logger(CronSyncProcessor.name);

  constructor(
    private readonly syncService: SyncService,
    private readonly usersService: UsersService,
    private readonly leaderboardService: LeaderboardService,
  ) {}

  @Process('sync-user-job')
  async handleCronSync(job: Job<{ userId: number }>) {
    const { userId } = job.data;
    try {
      const user = await this.usersService.findById(userId);
      if (user) {
        await this.syncService.syncUser(user);
      }
    } catch (error) {
      this.logger.error(`Cron Sync failed for user ${userId}`, error);
      throw error;
    }
  }

  @OnQueueDrained()
  async onDrained() {
    this.logger.log('Nightly sync queue drained. Updating leaderboard...');

    await this.leaderboardService.updateLeaderboard();

    this.logger.log('Leaderboard updated successfully.');
  }
}
