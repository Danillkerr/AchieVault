import { IsEnum } from 'class-validator';
import { RoadmapStatus } from '../entities/roadmap-game.entity';

export class UpdateGameStatusDto {
  @IsEnum(RoadmapStatus)
  status: RoadmapStatus;
}
