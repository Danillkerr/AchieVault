import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GuideRepository } from '../repositories/abstracts/guide.repository.abstract';
import { CreateGuide } from '../interfaces/guide.interfaces';
import { UpdateGuideDto } from '../dto/update-guide.dto';

@Injectable()
export class GuideService {
  constructor(
    @Inject(GuideRepository) private readonly guideRepo: GuideRepository,
  ) {}

  async createGuide(dto: CreateGuide) {
    return this.guideRepo.create(dto);
  }

  async getGuideById(id: number) {
    const guide = await this.guideRepo.findOne(id);
    if (!guide) throw new NotFoundException(`Guide ${id} not found`);
    return guide;
  }

  async getAllGuides(
    page: number = 1,
    limit: number = 10,
    user_id?: number,
    game_id?: number,
  ) {
    const { items, total } = await this.guideRepo.findAll({
      page,
      limit,
      user_id,
      game_id,
    });

    return {
      data: items,
      meta: {
        totalItems: total,
        itemCount: items.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  }

  private async _getGuideAndCheckOwner(guideId: number, userId: number) {
    const guide = await this.guideRepo.findOne(guideId);

    if (!guide) {
      throw new NotFoundException(`Guide with ID ${guideId} not found`);
    }

    if (guide.user.id !== userId) {
      throw new ForbiddenException('You are not the author of this guide');
    }

    return guide;
  }

  async updateGuide(userId: number, guideId: number, dto: UpdateGuideDto) {
    await this._getGuideAndCheckOwner(guideId, userId);

    return this.guideRepo.update(guideId, dto);
  }

  async deleteGuide(userId: number, guideId: number) {
    await this._getGuideAndCheckOwner(guideId, userId);

    await this.guideRepo.delete(guideId);
  }
}
