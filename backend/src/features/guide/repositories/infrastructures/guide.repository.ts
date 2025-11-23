import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async create(dto: CreateGuide): Promise<Guide> {
    const manager = this.getManager();

    const game = await manager.findOne(Game, {
      where: { steam_id: dto.steamId },
      select: ['id'],
    });

    if (!game) {
      throw new BadRequestException(
        `Game with Steam ID ${dto.steamId} not found in database.`,
      );
    }

    const newGuide = manager.create(Guide, {
      title: dto.title,
      text: dto.text,
      user: { id: dto.user_id },
      game: { id: game.id },
    });

    return manager.save(Guide, newGuide);
  }

  async findOne(id: number): Promise<Guide | null> {
    return this.guideRepo.findOne({
      where: { id },
      relations: { user: true, game: true },
    });
  }

  async findAll({ page, limit, user_id, game_id }: FindGuidesOptions) {
    const manager = this.getManager();

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

    if (user_id) {
      query.addSelect(
        `CASE WHEN Guide.user_id = :targetUserId THEN 0 ELSE 1 END`,
        'sort_priority',
      );

      query.setParameter('targetUserId', user_id);

      query.orderBy('sort_priority', 'ASC');

      query.addOrderBy('Guide.created_at', 'DESC');
    } else {
      query.orderBy('Guide.created_at', 'DESC');
    }

    query.take(limit);
    query.skip((page - 1) * limit);

    const [items, total] = await query.getManyAndCount();

    return { items, total };
  }

  async update(id: number, data: UpdateGuideDto): Promise<Guide> {
    const manager = this.getManager();

    await manager.update(Guide, id, data);

    return (await this.findOne(id))!;
  }

  async delete(id: number): Promise<void> {
    const manager = this.getManager();
    await manager.delete(Guide, id);
  }
}
