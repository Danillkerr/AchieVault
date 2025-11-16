import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { Game } from './game.entity';

@Entity('User_Game')
@Index(['user_id', 'game_id'], { unique: true })
export class UserGame {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ type: 'integer', nullable: false })
  user_id: number;

  @Column({ type: 'integer', nullable: false })
  game_id: number;

  @Column({ type: 'integer', default: 0 })
  playtime: number;

  @ManyToOne(() => User, (user) => user.user_games)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Game, (game) => game.user_games)
  @JoinColumn({ name: 'game_id' })
  game: Game;
}
