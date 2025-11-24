import { Module } from '@nestjs/common';
import { GameDiscoveryService } from '../services/game-discovery.service';
import { GameDiscoveryController } from '../controllers/game-discovery.controller';
import { SyncModule } from 'src/features/sync/modules/sync.module';
import { SteamModule } from 'src/features/api/steam/modules/steam.module';
import { GameDataModule } from 'src/features/game/game-data.module';
import { UserModule } from '../../users/modules/user.module';
import { UserAchievementModule } from '../../users/modules/user-achievement.module';

@Module({
  imports: [
    SteamModule,
    SyncModule,
    GameDataModule,
    UserModule,
    UserAchievementModule,
  ],
  providers: [GameDiscoveryService],
  controllers: [GameDiscoveryController],
})
export class GameDiscoveryModule {}
