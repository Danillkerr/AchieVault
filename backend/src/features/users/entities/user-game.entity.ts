import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  BaseEntity,
} from 'typeorm';
import { User } from '../../../core/entities/user.entity';
import { Game } from '../../game/entities/game.entity';

@Entity('User_Game')
@Index(['user_id', 'game_id'], { unique: true })
export class UserGame extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'integer', nullable: false })
  user_id: number;

  @Column({ type: 'integer', nullable: false })
  game_id: number;

  @Column({ type: 'integer', nullable: true, default: null })
  playtime: number;

  @ManyToOne(() => User, (user) => user.user_games)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Game, (game) => game.user_games)
  @JoinColumn({ name: 'game_id' })
  game: Game;
}
