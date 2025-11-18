import { Module } from '@nestjs/common';
import { UserModule } from './modules/user.module';
import { UserGameModule } from './modules/user-game.module';
import { UserAchievementModule } from './modules/user-achievement.module';
import { FriendListModule } from './modules/friend-list.module';
import { UserStatsModule } from './modules/user-stats.module';

@Module({
  imports: [
    UserModule,
    UserGameModule,
    UserAchievementModule,
    FriendListModule,
    UserStatsModule,
  ],
  exports: [
    UserModule,
    UserGameModule,
    UserAchievementModule,
    FriendListModule,
    UserStatsModule,
  ],
})
export class UserProfileModule {}
