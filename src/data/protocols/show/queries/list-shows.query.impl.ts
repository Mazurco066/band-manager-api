// Dependencies
import { IQuery } from '@nestjs/cqrs'

// Domain Protocols
import { ListShowsInput } from '@/domain/protocols'

// Data Protocols
import { TokenPayload } from '@/data/protocols'

// List shows query
export class ListShowsQuery implements IQuery {
  constructor(
    public readonly bandId: string,
    public readonly params: ListShowsInput,
    public readonly payload: TokenPayload
  ) {}
}
