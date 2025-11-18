import { Module } from '@nestjs/common';
import { UserGameService } from '../service/user-game.service';
import { Game } from 'src/features/game/entities/game.entity';
import { UserGame } from 'src/features/users/entities/user-game.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmUserGameRepository } from '../repositories/infrastructures/user-game.repository';
import { UserGameRepository } from '../repositories/abstracts/user-game.repository.abstract';

@Module({
  imports: [TypeOrmModule.forFeature([UserGame, Game])],
  providers: [
    UserGameService,
    TypeOrmUserGameRepository,
    {
      provide: UserGameRepository,
      useExisting: TypeOrmUserGameRepository,
    },
  ],
  exports: [UserGameService, UserGameRepository],
})
export class UserGameModule {}
