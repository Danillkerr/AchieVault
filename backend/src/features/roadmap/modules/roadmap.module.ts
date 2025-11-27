import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoadmapService } from '../services/roadmap.service';
import { RoadmapController } from '../controllers/roadmap.controller';
import { Roadmap } from '../entities/roadmap.entity';
import { RoadmapGame } from '../entities/roadmap-game.entity';
import { TypeOrmRoadmapRepository } from '../repositories/infrastructures/roadmap.repository';
import { RoadmapRepository } from '../repositories/abstracts/roadmap.repository.abstract';
import { GameService } from 'src/features/game/service/game.service';
import { RecommendationService } from '../services/recommendation.service';
import { UserProfileModule } from 'src/features/users/user-profile.module';
import { GameDataModule } from 'src/features/game/game-data.module';
import { TypeOrmRoadmapGameRepository } from '../repositories/infrastructures/roadmap-game.repository';
import { RoadmapGameRepository } from '../repositories/abstracts/roadmap-game.repository.abstract';

@Module({
  imports: [
    TypeOrmModule.forFeature([Roadmap, RoadmapGame]),
    TypeOrmModule.forFeature([]),
    GameDataModule,
    UserProfileModule,
  ],
  controllers: [RoadmapController],
  providers: [
    RoadmapService,
    RecommendationService,
    GameService,
    TypeOrmRoadmapRepository,
    {
      provide: RoadmapRepository,
      useExisting: TypeOrmRoadmapRepository,
    },
    TypeOrmRoadmapGameRepository,
    {
      provide: RoadmapGameRepository,
      useExisting: TypeOrmRoadmapGameRepository,
    },
  ],
  exports: [RoadmapService],
})
export class RoadmapModule {}
