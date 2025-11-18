import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendList } from 'src/features/users/entities/friendship.entity';
import { DeepPartial, EntityManager, Repository } from 'typeorm';
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
    if (friendUserIds.length === 0) return;

    const friendshipsToCreate: DeepPartial<FriendList>[] = [];

    for (const friendId of friendUserIds) {
      const user_1_id = Math.min(currentUserId, friendId);
      const user_2_id = Math.max(currentUserId, friendId);

      friendshipsToCreate.push({
        user: { id: user_1_id },
        friend: { id: user_2_id },
      });
    }

    const manager = this.getManager(transactionManager);

    await manager.upsert(FriendList, friendshipsToCreate, ['user', 'friend']);
  }
}
