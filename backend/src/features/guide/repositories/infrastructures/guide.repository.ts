import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { Guide } from '../../entities/guide.entity';
import { GuideRepository } from '../abstracts/guide.repository.abstract';
import { BaseTypeOrmRepository } from '../../../../core/repositories/base.repository';
import {
  CreateGuide,
  FindGuidesOptions,
} from '../../interfaces/guide.interfaces';
import { Game } from 'src/features/game/entities/game.entity';
import { UpdateGuideDto } from '../../dto/update-guide.dto';

@Injectable()
export class TypeOrmGuideRepository
  extends BaseTypeOrmRepository<Guide>
  implements GuideRepository
{
  constructor(
    @InjectRepository(Guide)
    private readonly guideRepo: Repository<Guide>,
  ) {
    super(guideRepo);
  }

  async findById(id: number, tm?: EntityManager): Promise<Guide | null> {
    return this.findOne(
      {
        where: { id },
        relations: { user: true, game: true },
      },
      tm,
    );
  }

  async findAll(
    { page, limit, user_id, game_id }: FindGuidesOptions,
    tm?: EntityManager,
  ): Promise<{ items: Guide[]; total: number }> {
    const manager = this.getManager(tm);

    const query = this.guideRepo
      .createQueryBuilder('Guide')
      .leftJoinAndSelect('Guide.user', 'user')
      .leftJoinAndSelect('Guide.game', 'game');

    if (game_id) {
      const game = await manager.findOne(Game, {
        where: { steam_id: `${game_id}` },
        select: ['id'],
      });

      if (game) {
        query.andWhere('Guide.game_id = :internalGameId', {
          internalGameId: game.id,
        });
      } else {
        return { items: [], total: 0 };
      }
    }

    this.applyCustomSort(query, user_id);

    query.take(limit).skip((page - 1) * limit);

    const [items, total] = await query.getManyAndCount();

    return { items, total };
  }

  async create(dto: CreateGuide, tm?: EntityManager): Promise<Guide> {
    const manager = this.getManager(tm);

    const game = await manager.findOne(Game, {
      where: { steam_id: dto.steamId },
      select: ['id'],
    });

    if (!game) {
      throw new BadRequestException(
        `Game with Steam ID ${dto.steamId} not found in database.`,
      );
    }

    return this.save({
      title: dto.title,
      text: dto.text,
      user: { id: dto.user_id },
      game: { id: game.id },
    });
  }

  async update(
    id: number,
    data: UpdateGuideDto,
    tm?: EntityManager,
  ): Promise<void> {
    await super.update(id, data, tm);
  }

  async delete(id: number, tm?: EntityManager): Promise<void> {
    await super.delete(id, tm);
  }

  private applyCustomSort(query: SelectQueryBuilder<Guide>, userId?: number) {
    if (userId) {
      query.addSelect(
        `CASE WHEN Guide.user_id = :targetUserId THEN 0 ELSE 1 END`,
        'sort_priority',
      );
      query.setParameter('targetUserId', userId);
      query.orderBy('sort_priority', 'ASC');
      query.addOrderBy('Guide.created_at', 'DESC');
    } else {
      query.orderBy('Guide.created_at', 'DESC');
    }
  }
}
