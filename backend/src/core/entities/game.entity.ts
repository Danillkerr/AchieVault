import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { UserGame } from './user-game.entity';

@Entity('Game')
export class Game {
  @PrimaryGeneratedColumn('uuid')
  @Index()
  id: number;

  @Column({ type: 'varchar', length: 25, unique: true, nullable: false })
  @Index()
  igdb_id: string;

  @Column({ type: 'varchar', length: 25, unique: true, nullable: false })
  @Index()
  steam_id: string;

  @Column({ type: 'numeric', precision: 5, scale: 2, nullable: true })
  rating: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string;

  @Column({ type: 'text', nullable: false })
  summary: string;

  @Column({ type: 'integer', nullable: true })
  time_to_beat: number;

  @Column({ type: 'text', nullable: true })
  logo: string;

  @Column({ type: 'text', nullable: true })
  url: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => UserGame, (userGame) => userGame.game)
  user_games: UserGame[];
}
