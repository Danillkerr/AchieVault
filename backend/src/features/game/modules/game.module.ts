import { Module } from '@nestjs/common';
import { GameService } from '../service/game.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from 'src/features/game/entities/game.entity';
import { TypeOrmGameRepository } from '../repositories/infrastructures/game.repository';
import { GameRepository } from '../repositories/abstracts/game.repository.abstract';

@Module({
  imports: [TypeOrmModule.forFeature([Game])],
  providers: [
    GameService,
    TypeOrmGameRepository,
    {
      provide: GameRepository,
      useExisting: TypeOrmGameRepository,
    },
  ],
  exports: [GameService, GameRepository],
})
export class GameModule {}
