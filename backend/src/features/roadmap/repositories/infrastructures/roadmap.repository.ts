import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { BaseTypeOrmRepository } from '../../../../core/repositories/base.repository';
import { Roadmap } from '../../entities/roadmap.entity';
import { RoadmapRepository } from '../abstracts/roadmap.repository.abstract';
import { RoadmapStatus } from '../../entities/roadmap-game.entity';
import { CreateRoadmapData } from '../../interface/RoadmapData.interface';

@Injectable()
export class TypeOrmRoadmapRepository
  extends BaseTypeOrmRepository<Roadmap>
  implements RoadmapRepository
{
  constructor(
    @InjectRepository(Roadmap) private readonly repo: Repository<Roadmap>,
  ) {
    super(repo);
  }

  async findById(id: number, tm?: EntityManager): Promise<Roadmap | null> {
    return this.findOne(
      {
        where: { id },
        relations: {
          games: {
            game: true,
          },
          recommendedGame: true,
        },
      },
      tm,
    );
  }

  async findLatestByUserId(
    userId: number,
    tm?: EntityManager,
  ): Promise<Roadmap | null> {
    return this.findOne(
      {
        where: { userId },
        relations: {
          games: {
            game: true,
          },
          recommendedGame: true,
        },
        order: {
          created_at: 'DESC',
        },
      },
      tm,
    );
  }

  async create(
    userId: number,
    data: CreateRoadmapData,
    tm?: EntityManager,
  ): Promise<Roadmap> {
    return this.save(
      {
        userId,
        name: data.name,
        etc_time: data.etcTime,
        total_achievements: data.totalAchievements,
        recGameId: data.recGameId || null,

        games: data.gameIds.map((gameId) => ({
          gameId,
          status: RoadmapStatus.PLANNED,
        })),
      },
      tm,
    );
  }

  async delete(id: number, tm?: EntityManager): Promise<void> {
    await super.delete(id, tm);
  }

  async updateRecommendedGame(
    roadmapId: number,
    gameId: number,
    tm?: EntityManager,
  ): Promise<void> {
    await this.update(roadmapId, { recGameId: gameId }, tm);
  }
}
