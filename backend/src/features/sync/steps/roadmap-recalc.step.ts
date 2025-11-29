import { Injectable, Logger } from '@nestjs/common';
import { ISyncStep } from '../../sync/interfaces/sync-step.interface';
import { User } from '../../users/entities/user.entity';
import { RoadmapService } from '../../roadmap/services/roadmap.service';

@Injectable()
export class RoadmapRecalcStep implements ISyncStep {
  name = 'RoadmapRecalc';
  private readonly logger = new Logger(RoadmapRecalcStep.name);

  constructor(private readonly roadmapService: RoadmapService) {}

  async execute(user: User): Promise<void> {
    await this.roadmapService.recalculateRoadmapStatuses(user.id);
  }
}
