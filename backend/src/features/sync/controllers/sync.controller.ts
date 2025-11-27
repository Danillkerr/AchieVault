import {
  Controller,
  NotFoundException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SyncService } from '../services/sync.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/core/entities/user.entity';
import { HttpStatus, HttpCode } from '@nestjs/common';

@Controller('sync')
export class SyncController {
  constructor(private syncService: SyncService) {}
  @Post('/')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.ACCEPTED)
  async syncAll(@Req() req) {
    const user = req.user as User;

    if (!user) throw new NotFoundException('User not found');

    const result = await this.syncService.triggerBackgroundSync(user.id);

    return result;
  }
}
