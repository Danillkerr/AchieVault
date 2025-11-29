import { User } from '../../users/entities/user.entity';

export interface ISyncStep {
  name: string;
  execute(user: User): Promise<void>;
}
