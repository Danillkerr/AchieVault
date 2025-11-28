import { EntityManager } from 'typeorm';
import { Guide } from '../../entities/guide.entity';
import {
  CreateGuide,
  FindGuidesOptions,
} from '../../interfaces/guide.interfaces';

export abstract class GuideRepository {
  abstract create(dto: CreateGuide, tm?: EntityManager): Promise<Guide>;

  abstract findById(id: number, tm?: EntityManager): Promise<Guide | null>;

  abstract findAll(
    options: FindGuidesOptions,
    tm?: EntityManager,
  ): Promise<{ items: Guide[]; total: number }>;

  abstract update(
    id: number,
    data: Partial<Guide>,
    tm?: EntityManager,
  ): Promise<void>;

  abstract delete(id: number, tm?: EntityManager): Promise<void>;
}
