// Dependecies
import { ObjectId } from 'mongodb'

// Indentifier
import { Identifier } from './identifier'

/**
 * @param id is optional as string.
 * If id is provided returns itself else generate a new object id
 */
export class UniqueObjectID extends Identifier<ObjectId> {
  constructor(id?: ObjectId) {
    super(id ? id : new ObjectId())
  }
}
