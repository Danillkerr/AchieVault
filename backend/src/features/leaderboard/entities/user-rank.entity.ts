import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../../core/entities/user.entity';

@Entity('Rating')
export class UserRank {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id', unique: true })
  userId: number;

  @Column({ type: 'int' })
  rank_completed: number;

  @Column({ type: 'int' })
  rank_achievement: number;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
