import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../../core/entities/user.entity';
import { Game } from '../../game/entities/game.entity';
import { RoadmapGame } from './roadmap-game.entity';

@Entity('Roadmap')
export class Roadmap {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => Game, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'rec_game_id' })
  recommendedGame: Game;

  @Column({ name: 'rec_game_id', nullable: true })
  recGameId: number;

  @Column()
  name: string;

  @Column({ type: 'int', default: 0 })
  etc_time: number;

  @Column({ type: 'int', default: 0 })
  total_achievements: number;

  @OneToMany(() => RoadmapGame, (rg) => rg.roadmap, { cascade: true })
  games: RoadmapGame[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
