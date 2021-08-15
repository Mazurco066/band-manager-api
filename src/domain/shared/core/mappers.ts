/**
 * `TargetPersistence` as Entity to persist on database and
 * `DomainAggreate` as Aggregate entity from domain
 * @method toPersistence receives a `DomainAggreate` target and transform it on `TargetPersistence`
 *
 */
export default interface IMapper<Entity> {
  toPersistence: (target: Entity) => Entity
}

export { IMapper }
