// Dependencies
import { IQuery } from '@nestjs/cqrs'

// Domain Protocols
import { ListPublicSongsInput } from '@/domain/protocols'

// Data Protocols
import { TokenPayload } from '@/data/protocols'

// Add account command
export class ListPublicSongsQuery implements IQuery {
  constructor(
    public readonly params: ListPublicSongsInput,
    public readonly payload: TokenPayload
  ) {}
}
