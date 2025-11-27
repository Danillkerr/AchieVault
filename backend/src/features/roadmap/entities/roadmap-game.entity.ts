import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { Roadmap } from './roadmap.entity';
import { Game } from '../../game/entities/game.entity';

export enum RoadmapStatus {
  PLANNED = 'planned',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  DEFERRED = 'deferred',
}

@Entity('Roadmap_Game')
@Unique(['roadmapId', 'gameId'])
export class RoadmapGame {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Roadmap, (r) => r.games, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roadmap_id' })
  roadmap: Roadmap;

  @Column({ name: 'roadmap_id' })
  roadmapId: number;

  @ManyToOne(() => Game, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'game_id' })
  game: Game;

  @Column({ name: 'game_id' })
  gameId: number;

  @Column({
    type: 'varchar',
    length: 11,
    default: RoadmapStatus.PLANNED,
  })
  status: RoadmapStatus;

  @UpdateDateColumn()
  updated_at: Date;
}
