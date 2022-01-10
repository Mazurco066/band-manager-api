// Dependencies
import { IQuery } from '@nestjs/cqrs'

// Domain Protocols
import { ListBandsInput } from '@/domain/protocols'

// Data Protocols
import { TokenPayload } from '@/data/protocols'

// Load Account Command
export class ListBandsQuery implements IQuery {
  constructor(
    public readonly params: ListBandsInput,
    public readonly payload: TokenPayload
  ) {}
}