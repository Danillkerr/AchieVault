import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/abstracts/user.repository.abstract';
import { FriendshipRepository } from '../repositories/abstracts/friendship.repository.abstract';
import { EntityManager } from 'typeorm';

@Injectable()
export class FriendListService {
  constructor(
    @Inject(FriendshipRepository)
    private readonly friendshipRepo: FriendshipRepository,
    @Inject(UserRepository)
    private readonly userRepo: UserRepository,
  ) {}

  async syncFriendsBySteamIds(
    currentUserId: number,
    friendSteamIds: string[],
    transactionManager?: EntityManager,
  ): Promise<void> {
    if (friendSteamIds.length === 0) return;

    const friendUsers = await this.userRepo.findBySteamIds(
      friendSteamIds,
      transactionManager,
    );

    if (friendUsers.length === 0) return;

    const friendUserIds = friendUsers.map((user) => user.id);

    await this.friendshipRepo.bulkCreate(
      currentUserId,
      friendUserIds,
      transactionManager,
    );
  }
}
