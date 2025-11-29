import { User } from '../../../core/entities/user.entity';

export interface ISyncStep {
  name: string;
  execute(user: User): Promise<void>;
}
