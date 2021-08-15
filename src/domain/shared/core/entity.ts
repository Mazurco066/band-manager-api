// Domain Entity
import { BaseDomainEntity } from './base-domain-entity'
// Identifier
import { Identifier } from './identifier'

const isEntity = (v: any): v is Entity<any> => {
  return v instanceof Entity
}

export abstract class Entity<T extends BaseDomainEntity> {
  protected readonly _id: Identifier<string | number>
  protected readonly props: T

  constructor(props: T, id?: Identifier<string | number>) {
    this._id = id || id
    this.props = props
  }

  get created_at(): Date {
    return this.props.created_at ?? new Date()
  }

  get updated_at(): Date {
    return this.props.updated_at ?? new Date()
  }

  get is_deleted(): boolean {
    return this.props.isDeleted ?? false
  }

  public equals(object?: Entity<T>): boolean {
    if (object == null || object == undefined) {
      return false
    }

    if (this === object) {
      return true
    }

    if (!isEntity(object)) {
      return false
    }

    return this._id.equals(object._id)
  }
}
