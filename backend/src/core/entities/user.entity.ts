import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BaseEntity,
} from 'typeorm';
import { UserGame } from '../../features/users/entities/user-game.entity';

@Entity('User')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  @Index()
  id: number;

  @Column({ type: 'varchar', length: 17, unique: true, nullable: false })
  @Index()
  steamid: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'text' })
  avatar: string;

  @Column({ type: 'integer', nullable: false, default: 0 })
  achievement_count: number;

  @Column({ type: 'integer', nullable: false, default: 0 })
  completed_count: number;

  @Column({ type: 'integer', nullable: false, default: 0 })
  game_count: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => UserGame, (userGame) => userGame.user)
  user_games: UserGame[];
}
