import { Process, Processor } from '@nestjs/bull';
import type { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { SyncService } from '../services/sync.service';
import { UsersService } from '../../users/services/users.service';
import { RoadmapService } from 'src/features/roadmap/services/roadmap.service';

@Processor('user-sync-queue')
export class UserSyncProcessor {
  private readonly logger = new Logger(UserSyncProcessor.name);

  constructor(
    private readonly syncService: SyncService,
    private readonly UsersService: UsersService,
    private readonly roadmapService: RoadmapService,
  ) {}

  @Process('sync-user-job')
  async handleUserSync(job: Job<{ userId: number }>) {
    const { userId } = job.data;

    try {
      const user = await this.UsersService.findById(userId);
      if (user) {
        await this.syncService.syncUser(user);
        await this.roadmapService.refreshRoadmap(user.id);
      }
    } catch (error) {
      this.logger.error(`User Sync failed for user ${userId}`, error);
      throw error;
    }
  }
}
