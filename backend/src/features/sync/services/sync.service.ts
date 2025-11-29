import { Injectable, Logger, Inject } from '@nestjs/common';
import { User } from 'src/features/users/entities/user.entity';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { ISyncStep } from '../interfaces/sync-step.interface';

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);

  constructor(
    @Inject('SYNC_STEPS') private readonly steps: ISyncStep[],
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectQueue('user-sync-queue') private userQueue: Queue,
  ) {}

  async triggerBackgroundSync(
    userId: number,
  ): Promise<{ status: 'queued' | 'cooldown'; message: string }> {
    const key = `sync_cooldown:${userId}`;
    const isCooldown = await this.cacheManager.get(key);

    if (isCooldown) {
      this.logger.log(`User ${userId} is on sync cooldown. Skipping.`);
      return {
        status: 'cooldown',
        message: 'Profile was updated recently. Try again later.',
      };
    }

    this.logger.log(`Triggering background sync for user ${userId}`);
    await this.userQueue.add('sync-user-job', { userId });
    await this.cacheManager.set(key, 'true', 1800 * 1000);

    return {
      status: 'queued',
      message: 'Synchronization started in background.',
    };
  }

  async syncUser(user: User): Promise<void> {
    try {
      for (const step of this.steps) {
        await step.execute(user);
      }
      this.logger.log(`Full sync completed for ${user.name}`);
    } catch (error) {
      this.logger.error(`Sync failed for user ${user.id}`, error);
      throw error;
    }
  }
}
