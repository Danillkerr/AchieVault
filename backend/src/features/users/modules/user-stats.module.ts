import { Module } from '@nestjs/common';
import { UserStatsService } from '../service/user-stats.service';
import { UserModule } from './user.module';
import { UserAchievementModule } from './user-achievement.module';

@Module({
  imports: [UserModule, UserAchievementModule],
  providers: [UserStatsService],
  exports: [UserStatsService],
})
export class UserStatsModule {}
