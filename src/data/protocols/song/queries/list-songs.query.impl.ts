// Dependencies
import { IQuery } from '@nestjs/cqrs'

// Domain Protocols
import { ListSongsInput } from '@/domain/protocols'

// Data Protocols
import { TokenPayload } from '@/data/protocols'

// Add account command
export class ListSongsQuery implements IQuery {
  constructor(
    public readonly params: ListSongsInput,
    public readonly payload: TokenPayload
  ) {}
}