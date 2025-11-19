import { Controller, Get, Req } from '@nestjs/common';
import { LeaderboardService } from '../services/leaderboard.service';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private leaderboardService: LeaderboardService) {}
  @Get()
  async refreshRanks(@Req() req) {
    this.leaderboardService.updateLeaderboard();
    return { message: 'Game synchronization has been started.' };
  }
}
