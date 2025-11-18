import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { SyncService } from '../service/sync.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/core/entities/user.entity';

@Controller('sync')
export class SyncController {
  constructor(private syncService: SyncService) {}

  @Get('games')
  @UseGuards(AuthGuard('jwt'))
  async syncData(@Req() req) {
    const user = req.user as User;

    this.syncService.syncUserGames(user);

    return { message: 'Game synchronization has been started.' };
  }

  @Get('achievements')
  @UseGuards(AuthGuard('jwt'))
  async syncAchievements(@Req() req) {
    const user = req.user as User;

    this.syncService.syncUsersAchievements(user);

    return { message: 'Achievement synchronization has been started.' };
  }

  @Get('all')
  @UseGuards(AuthGuard('jwt'))
  async syncAll(@Req() req) {
    const user = req.user as User;
    this.syncService.syncUser(user);

    return { message: 'Full synchronization has been started.' };
  }
}
