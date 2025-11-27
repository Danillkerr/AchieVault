import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  BaseEntity,
  Index,
} from 'typeorm';
import { ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../../core/entities/user.entity';
import { Achievement } from '../../game/entities/achievement.entity';

@Entity('User_Achievement')
@Unique(['user', 'achievement'])
@Index(['user', 'achievement'], { unique: true })
export class UserAchievement extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'timestamp', nullable: true })
  obtained: Date | null;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Achievement)
  @JoinColumn({ name: 'achievement_id' })
  achievement: Achievement;
}
