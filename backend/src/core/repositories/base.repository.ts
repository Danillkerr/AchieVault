import {
  Repository,
  EntityManager,
  ObjectLiteral,
  FindOneOptions,
  FindManyOptions,
  DeepPartial,
  FindOptionsWhere,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/browser/query-builder/QueryPartialEntity.js';

export abstract class BaseTypeOrmRepository<T extends ObjectLiteral> {
  private readonly _repo: Repository<T>;

  constructor(repo: Repository<T>) {
    this._repo = repo;
  }

  protected getManager(transactionManager?: EntityManager): EntityManager {
    return transactionManager || this._repo.manager;
  }

  protected async findOne(
    options: FindOneOptions<T>,
    transactionManager?: EntityManager,
  ): Promise<T | null> {
    const manager = this.getManager(transactionManager);
    return manager.findOne(this._repo.target, options);
  }

  protected async find(
    options?: FindManyOptions<T>,
    transactionManager?: EntityManager,
  ): Promise<T[]> {
    const manager = this.getManager(transactionManager);
    return manager.find(this._repo.target, options);
  }

  protected async exists(
    where: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    tm?: EntityManager,
  ): Promise<boolean> {
    const count = await this.count({ where }, tm);
    return count > 0;
  }

  protected async save(
    entity: DeepPartial<T>,
    transactionManager?: EntityManager,
  ): Promise<T> {
    const manager = this.getManager(transactionManager);
    return manager.save(this._repo.target, entity);
  }

  protected async saveMany(
    entities: DeepPartial<T>[],
    tm?: EntityManager,
  ): Promise<T[]> {
    const manager = this.getManager(tm);
    return manager.save(this._repo.target, entities);
  }

  protected async update(
    criteria: FindOptionsWhere<T> | number | string,
    partialEntity: QueryDeepPartialEntity<T>,
    transactionManager?: EntityManager,
  ): Promise<void> {
    const manager = this.getManager(transactionManager);
    await manager.update(this._repo.target, criteria, partialEntity);
  }

  protected async delete(
    criteria: FindOptionsWhere<T> | number | string,
    transactionManager?: EntityManager,
  ): Promise<void> {
    const manager = this.getManager(transactionManager);
    await manager.delete(this._repo.target, criteria);
  }

  protected async upsert(
    entities: QueryDeepPartialEntity<T> | QueryDeepPartialEntity<T>[],
    conflictPaths: string[],
    transactionManager?: EntityManager,
  ): Promise<void> {
    const manager = this.getManager(transactionManager);
    await manager.upsert(this._repo.target, entities, {
      conflictPaths: conflictPaths,
      skipUpdateIfNoValuesChanged: true,
    });
  }

  protected async count(
    options: FindManyOptions<T>,
    transactionManager?: EntityManager,
  ): Promise<number> {
    const manager = this.getManager(transactionManager);
    return manager.count(this._repo.target, options);
  }
}
