import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { RoadmapGame } from '../../entities/roadmap-game.entity';
import { RoadmapGameRepository } from '../abstracts/roadmap-game.repository.abstract';
import { BaseTypeOrmRepository } from 'src/core/repositories/base.repository';
import { RoadmapStatus } from '../../entities/roadmap-game.entity';

@Injectable()
export class TypeOrmRoadmapGameRepository
  extends BaseTypeOrmRepository<RoadmapGame>
  implements RoadmapGameRepository
{
  constructor(@InjectRepository(RoadmapGame) repo: Repository<RoadmapGame>) {
    super(repo);
  }

  async updateStatus(
    id: number,
    status: RoadmapStatus,
    tm?: EntityManager,
  ): Promise<void> {
    await this.update(id, { status }, tm);
  }

  async updateStatusByRelation(
    roadmapId: number,
    gameId: number,
    status: RoadmapStatus,
    tm?: EntityManager,
  ): Promise<void> {
    await this.update({ roadmapId, gameId }, { status }, tm);
  }
}
