// Dependencies
import { IQuery } from '@nestjs/cqrs'

// Data Protocols
import { TokenPayload } from '@/data/protocols'

// List shows query
export class ListShowsByAccountQuery implements IQuery {
  constructor(
    public readonly payload: TokenPayload
  ) {}
}
