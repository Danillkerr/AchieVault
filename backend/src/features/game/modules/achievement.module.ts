import { Module } from '@nestjs/common';
import { AchievementService } from '../service/achievement.service';
import { Achievement } from 'src/features/game/entities/achievement.entity';
import { AchievementRepository } from '../repositories/abstracts/achievement.repository.abstract';
import { TypeOrmAchievementRepository } from '../repositories/infrastructures/achievement.repository';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';

@Module({
  imports: [TypeOrmModule.forFeature([Achievement])],
  providers: [
    AchievementService,
    TypeOrmAchievementRepository,
    {
      provide: AchievementRepository,
      useExisting: TypeOrmAchievementRepository,
    },
  ],
  exports: [AchievementService, AchievementRepository],
})
export class AchievementModule {}
