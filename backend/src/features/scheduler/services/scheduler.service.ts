import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';
import { UsersService } from '../../users/services/users.service';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    @InjectQueue('cron-sync-queue') private cronQueue: Queue,
    private readonly usersService: UsersService,
  ) {}
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDailySync() {
    this.logger.log('CRON TRIGGERED: Starting batch sync...');

    try {
      const users = await this.usersService.findAll();

      if (users.length === 0) {
        this.logger.warn('No users to sync!');
        return;
      }

      const jobs = users.map((u) => ({
        name: 'sync-user-job',
        data: { userId: u.id },
        opts: { removeOnComplete: true },
      }));

      await this.cronQueue.addBulk(jobs);

      this.logger.log(`Sent ${jobs.length} jobs to Redis.`);
    } catch (error) {
      this.logger.error('Cron failed:', error);
    }
  }
}
