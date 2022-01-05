// Dependencies
import { IQuery } from '@nestjs/cqrs'

// Data Protocols
import { TokenPayload } from '@/data/protocols'

// Load Account Command
export class LoadMeQuery implements IQuery {
  constructor(
    public readonly payload: TokenPayload
  ) {}
}
