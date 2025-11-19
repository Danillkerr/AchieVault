import { Module } from '@nestjs/common';
import { LeaderboardService } from '../services/leaderboard.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRank } from '../entities/user-rank.entity';
import { TypeOrmLeaderboardRepository } from '../repositories/infrastructures/leaderboard.repository';
import { LeaderboardRepository } from '../repositories/abstracts/leaderboard.repository.abstract';
import { LeaderboardController } from '../controllers/leaderboard.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserRank])],
  providers: [
    LeaderboardService,
    TypeOrmLeaderboardRepository,
    {
      provide: LeaderboardRepository,
      useExisting: TypeOrmLeaderboardRepository,
    },
  ],
  exports: [LeaderboardService],
  controllers: [LeaderboardController],
})
export class LeaderboardModule {}
