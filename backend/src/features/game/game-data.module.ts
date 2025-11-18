import { Module } from '@nestjs/common';
import { GameModule } from './modules/game.module';
import { AchievementModule } from './modules/achievement.module';

@Module({
  imports: [GameModule, AchievementModule],
  exports: [GameModule, AchievementModule],
})
export class GameDataModule {}
