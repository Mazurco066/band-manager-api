// Dependencies
import { IQuery } from '@nestjs/cqrs'

// Domain Protocols
import { LoadShowByIdInput } from '@/domain/protocols'

// Data Protocols
import { TokenPayload } from '@/data/protocols'

// List shows query
export class LoadShowQuery implements IQuery {
  constructor(
    public readonly params: LoadShowByIdInput,
    public readonly payload: TokenPayload
  ) {}
}
