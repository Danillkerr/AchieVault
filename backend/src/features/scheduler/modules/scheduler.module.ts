import { Module } from '@nestjs/common';
import { SchedulerService } from '../services/scheduler.service';
import { SyncModule } from '../../sync/modules/sync.module';
import { UserProfileModule } from '../../users/user-profile.module';

@Module({
  imports: [SyncModule, UserProfileModule],
  providers: [SchedulerService],
})
export class SchedulerModule {}
