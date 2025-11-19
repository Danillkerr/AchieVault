import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { SyncService } from '../services/sync.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/core/entities/user.entity';

@Controller('sync')
export class SyncController {
  constructor(private syncService: SyncService) {}
  @Get('all')
  @UseGuards(AuthGuard('jwt'))
  async syncAll(@Req() req) {
    const user = req.user as User;

    if (user) {
      this.syncService.triggerBackgroundSync(user.id).catch((err) => {
        console.error('Background sync error:', err);
      });
    }

    return { message: 'Full synchronization has been started.' };
  }
}
