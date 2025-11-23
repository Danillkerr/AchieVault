import { Module } from '@nestjs/common';
import { GuideService } from '../service/guide.service';
import { GuideController } from '../controller/guide.controller';
import { TypeOrmGuideRepository } from '../repositories/infrastructures/guide.repository';
import { GuideRepository } from '../repositories/abstracts/guide.repository.abstract';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Guide } from '../entities/guide.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Guide])],
  controllers: [GuideController],
  providers: [
    GuideService,
    TypeOrmGuideRepository,
    {
      provide: GuideRepository,
      useExisting: TypeOrmGuideRepository,
    },
  ],
})
export class GuideModule {}
