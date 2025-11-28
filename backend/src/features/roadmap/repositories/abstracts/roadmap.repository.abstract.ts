import { EntityManager } from 'typeorm';
import { Roadmap } from '../../entities/roadmap.entity';
import { CreateRoadmapData } from '../../interface/RoadmapData.interface';

export abstract class RoadmapRepository {
  abstract findById(id: number, tm?: EntityManager): Promise<Roadmap | null>;

  abstract findLatestByUserId(
    userId: number,
    tm?: EntityManager,
  ): Promise<Roadmap | null>;

  abstract create(
    userId: number,
    data: CreateRoadmapData,
    tm?: EntityManager,
  ): Promise<Roadmap>;

  abstract delete(id: number, tm?: EntityManager): Promise<void>;

  abstract updateRecommendedGame(
    roadmapId: number,
    gameId: number | null,
    tm?: EntityManager,
  ): Promise<void>;
}
