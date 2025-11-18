import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  BaseEntity,
} from 'typeorm';
import { ManyToOne, JoinColumn } from 'typeorm';
import { Game } from './game.entity';

@Entity('Achievement')
@Unique(['game', 'api_name'])
export class Achievement extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  api_name: string;

  @ManyToOne(() => Game)
  @JoinColumn({ name: 'game_id' })
  game: Game;
}
