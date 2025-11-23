import { Guide } from '../../entities/guide.entity';
import {
  CreateGuide,
  FindGuidesOptions,
} from '../../interfaces/guide.interfaces';

export abstract class GuideRepository {
  abstract create(dto: CreateGuide): Promise<Guide>;

  abstract findOne(id: number): Promise<Guide | null>;

  abstract findAll(
    options: FindGuidesOptions,
  ): Promise<{ items: Guide[]; total: number }>;

  abstract update(id: number, data: Partial<Guide>): Promise<Guide>;

  abstract delete(id: number): Promise<void>;
}
