import { Module } from '@nestjs/common';
import { UserGameService } from '../services/user-game.service';
import { Game } from 'src/features/game/entities/game.entity';
import { UserGame } from 'src/features/users/entities/user-game.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmUserGameRepository } from '../repositories/infrastructures/user-game.repository';
import { UserGameRepository } from '../repositories/abstracts/user-game.repository.abstract';
import { UserGameController } from '../controller/user-game.controller';

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
  controllers: [UserGameController],
})
export class UserGameModule {}
