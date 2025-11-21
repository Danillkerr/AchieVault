import {
  Controller,
  Get,
  Query,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LeaderboardService } from '../services/leaderboard.service';
import { GetLeaderboardDto } from '../dto/get-leaderboard.dto';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private leaderboardService: LeaderboardService) {}
  @Get()
  async refreshRanks(@Req() req) {
    this.leaderboardService.updateLeaderboard();
    return { message: 'Game synchronization has been started.' };
  }

  @Get('/users')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getLeaderboard(@Query() query: GetLeaderboardDto) {
    return this.leaderboardService.getLeaderboard(query);
  }
}
