// Dependencies
import { IQuery } from '@nestjs/cqrs'

// Domain Protocols
import { ListPublicSongsInput } from '@/domain/protocols'

// Add account command
export class ListPublicSongsQuery implements IQuery {
  constructor(
    public readonly params: ListPublicSongsInput,
  ) {}
}
