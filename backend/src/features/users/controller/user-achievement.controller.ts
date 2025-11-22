import { Controller, Get, ParseIntPipe, Param } from '@nestjs/common';
import { UserAchievementService } from '../services/user-achievement.service';

@Controller('users-achievements')
export class UserAchievementController {
  constructor(
    private readonly userAchievementService: UserAchievementService,
  ) {}

  @Get(':id/:steamId/progress')
  async getUserGameProgress(
    @Param('id', ParseIntPipe) userId: number,
    @Param('steamId') steamId: string,
  ) {
    const userAchievements = await this.userAchievementService.getUserProgress(
      userId,
      steamId,
    );

    return userAchievements.map((ua) => ({
      apiName: ua.achievement.api_name,
      obtainedAt: ua.obtained,
    }));
  }
}
