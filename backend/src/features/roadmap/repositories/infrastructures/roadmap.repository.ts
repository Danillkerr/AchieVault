import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async findById(id: number): Promise<Roadmap | null> {
    const manager = this.getManager();
    return manager.findOne(Roadmap, {
      where: { id },
      relations: {
        games: {
          game: true,
        },
        recommendedGame: true,
      },
    });
  }

  async create(userId: number, data: CreateRoadmapData): Promise<Roadmap> {
    const manager = this.getManager();

    const roadmap = manager.create(Roadmap, {
      name: data.name,
      userId: userId,
      etc_time: data.etcTime,
      total_achievements: data.totalAchievements,
      recGameId: data.recGameId || undefined,

      games: data.gameIds.map((gameId) => ({
        gameId: gameId,
        status: RoadmapStatus.PLANNED,
      })),
    });

    return manager.save(Roadmap, roadmap);
  }

  async findLatestByUserId(userId: number): Promise<Roadmap | null> {
    const manager = this.getManager();

    return manager.findOne(Roadmap, {
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
    });
  }

  async delete(id: number): Promise<void> {
    const manager = this.getManager();
    await manager.delete(Roadmap, id);
  }

  async updateRecommendedGame(
    roadmapId: number,
    gameId: number | null,
  ): Promise<void> {
    const manager = this.getManager();
    if (gameId === null) {
      await manager.update(Roadmap, roadmapId, { recGameId: () => 'NULL' });
    } else {
      await manager.update(Roadmap, roadmapId, { recGameId: gameId });
    }
  }
}
