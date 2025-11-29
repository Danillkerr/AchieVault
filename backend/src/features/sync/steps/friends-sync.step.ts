import { Inject, Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ISyncStep } from '../interfaces/sync-step.interface';
import { User } from '../../../core/entities/user.entity';
import { FriendListService } from '../../users/services/friend-list.service';
import { ISocialSource } from 'src/core/repositories/interfaces/social-source.interface';

@Injectable()
export class FriendsSyncStep implements ISyncStep {
  name = 'FriendsSync';
  private readonly logger = new Logger(FriendsSyncStep.name);

  constructor(
    @Inject(ISocialSource) private readonly socialSource: ISocialSource,
    private readonly friendListService: FriendListService,
    private readonly dataSource: DataSource,
  ) {}

  async execute(user: User): Promise<void> {
    const friendSteamIds = await this.socialSource.getFriendIds(user.steamid);
    if (friendSteamIds.length === 0) return;

    await this.dataSource.transaction(async (manager) => {
      await this.friendListService.syncFriendsBySteamIds(
        user.id,
        friendSteamIds,
        manager,
      );
    });

    this.logger.log(`Synced ${friendSteamIds.length} friends.`);
  }
}
