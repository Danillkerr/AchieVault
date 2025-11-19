import { Module } from '@nestjs/common';
import { UserAchievementService } from '../services/user-achievement.service';
import { UserAchievementRepository } from '../repositories/abstracts/user-achievement.repository.abstract';
import { TypeOrmUserAchievementRepository } from '../repositories/infrastructures/user-achievement.repository';
import { UserAchievement } from 'src/features/users/entities/user-achievement.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserAchievement])],
  providers: [
    UserAchievementService,
    TypeOrmUserAchievementRepository,
    {
      provide: UserAchievementRepository,
      useExisting: TypeOrmUserAchievementRepository,
    },
  ],
  exports: [UserAchievementService, UserAchievementRepository],
})
export class UserAchievementModule {}
