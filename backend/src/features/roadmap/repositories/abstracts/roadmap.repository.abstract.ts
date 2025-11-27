import { Roadmap } from '../../entities/roadmap.entity';
import { CreateRoadmapData } from '../../interface/RoadmapData.interface';

export abstract class RoadmapRepository {
  abstract findById(id: number): Promise<Roadmap | null>;

  abstract findLatestByUserId(userId: number): Promise<Roadmap | null>;

  abstract create(userId: number, data: CreateRoadmapData): Promise<Roadmap>;

  abstract delete(id: number): Promise<void>;

  abstract updateRecommendedGame(
    roadmapId: number,
    gameId: number | null,
  ): Promise<void>;
}
