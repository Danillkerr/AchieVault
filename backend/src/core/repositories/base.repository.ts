import { Repository, EntityManager, ObjectLiteral } from 'typeorm';

export abstract class BaseTypeOrmRepository<T extends ObjectLiteral> {
  private readonly _repo: Repository<T>;

  constructor(repo: Repository<T>) {
    this._repo = repo;
  }

  protected getManager(transactionManager?: EntityManager): EntityManager {
    return transactionManager || this._repo.manager;
  }
}
