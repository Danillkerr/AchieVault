import { Module } from '@nestjs/common';
import { FriendListService } from '../services/friend-list.service';
import { UserModule } from './user.module';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { FriendList } from 'src/features/users/entities/friendship.entity';
import { TypeOrmFriendshipRepository } from '../repositories/infrastructures/friendship.repository';
import { FriendshipRepository } from '../repositories/abstracts/friendship.repository.abstract';

@Module({
  imports: [TypeOrmModule.forFeature([FriendList]), UserModule],
  providers: [
    FriendListService,
    TypeOrmFriendshipRepository,
    {
      provide: FriendshipRepository,
      useExisting: TypeOrmFriendshipRepository,
    },
  ],
  exports: [FriendListService, FriendshipRepository],
})
export class FriendListModule {}
