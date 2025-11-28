import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendList } from 'src/features/users/entities/friendship.entity';
import { EntityManager, Repository } from 'typeorm';
import { FriendshipRepository } from '../abstracts/friendship.repository.abstract';
import { BaseTypeOrmRepository } from 'src/core/repositories/base.repository';

@Injectable()
export class TypeOrmFriendshipRepository
  extends BaseTypeOrmRepository<FriendList>
  implements FriendshipRepository
{
  constructor(
    @InjectRepository(FriendList)
    private readonly friendListRepo: Repository<FriendList>,
  ) {
    super(friendListRepo);
  }

  async bulkCreate(
    currentUserId: number,
    friendUserIds: number[],
    transactionManager?: EntityManager,
  ): Promise<void> {
    const uniqueFriendIds = [...new Set(friendUserIds)].filter(
      (id) => id !== currentUserId,
    );

    if (uniqueFriendIds.length === 0) return;

    const friendshipsToUpsert = uniqueFriendIds.map((friendId) => ({
      user: { id: Math.min(currentUserId, friendId) },
      friend: { id: Math.max(currentUserId, friendId) },
    }));

    await this.upsert(
      friendshipsToUpsert,
      ['user', 'friend'],
      transactionManager,
    );
  }
}
