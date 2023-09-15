// Dependencies
import { IQuery } from '@nestjs/cqrs'

// Domain Protocols
import { ListShowsV2Input } from '@/domain/protocols'

// Data Protocols
import { TokenPayload } from '@/data/protocols'

// List shows query
export class ListShowsQueryV2 implements IQuery {
  constructor(
    public readonly bandId: string,
    public readonly params: ListShowsV2Input,
    public readonly payload: TokenPayload
  ) {}
}
