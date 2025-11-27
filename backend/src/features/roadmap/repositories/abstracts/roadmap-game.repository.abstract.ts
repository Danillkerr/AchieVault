import { RoadmapStatus } from '../../entities/roadmap-game.entity';

export abstract class RoadmapGameRepository {
  abstract updateStatus(id: number, status: RoadmapStatus): Promise<void>;

  abstract updateStatusByRelation(
    roadmapId: number,
    gameId: number,
    status: RoadmapStatus,
  ): Promise<void>;
}
