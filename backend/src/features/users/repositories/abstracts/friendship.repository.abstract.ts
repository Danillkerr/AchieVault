import { EntityManager } from 'typeorm';

export abstract class FriendshipRepository {
  abstract bulkCreate(
    currentUserId: number,
    friendUserIds: number[],
    transactionManager?: EntityManager,
  ): Promise<void>;
}
