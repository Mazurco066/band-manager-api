// Filter
import { Filter } from './filter'

/**
 * `Entity` as Entity
 * @example Entity from domain
 *
 * @description define interface for default repository as C.R.Q.S principle.
 * Inject the `connection` and `mapper` on constructor
 *
 * @example
 *    constructor(
 *        private readonly connection: Connection,
 *        private readonly mapper: IMapper<Entity, Entity>,
 *   ) {}
 *
 * @description Methods to implement
 * @method find
 * @method findOne
 * @method delete
 * @method exists
 * @method save
 */
export interface IBaseRepository<Entity> {
  /**
   * @param filter as `{key: value}`
   * @returns Promise with Array of `Entity` or `null`
   */
  find: (filter: Filter) => Promise<Entity[] | null>
  /**
   * @param filter as `{key: value}`
   * @returns Promise with `Entity` or `null`
   */
  findOne: (filter: Filter) => Promise<Entity | null>
  /**
   * @param filter as `{key: value}`
   * @returns Promise `void`
   */
  delete: (filter: Filter) => Promise<boolean>
  /**
   * @param filter as `{key: value}`
   * @returns Promise `boolean`
   */
  exists: (filter: Filter) => Promise<boolean>
  /**
   * @param target as Entity
   * @returns Promise `void`
   *
   * @description this method must update or create on cascade
   *
   * @example
   * async save(target: Entity): Promise<void> {
   *
   *  const persistenceTarget = this.mapper.toPersistence(target);
   *
   *  const { id } = persistenceTarget;
   *
   *  exist = await this.exists({ id });
   *
   *  // if target already exist update it else create new one
   *  if (exist) {
   *       await this.connection.update(persistenceTarget);
   *  } else {
   *       await this.connection.create(persistenceTarget);
   *  }
   * }
   *
   */
  save: (target: Entity) => Promise<Entity>
}
