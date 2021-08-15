// Dependencies
import { IQuery } from '@nestjs/cqrs'

// Domain Protocols
import { LoadAccountByIdInput } from '@/domain/protocols'

// Data Protocols
import { TokenPayload } from '@/data/protocols'

// Load Account Command
export class LoadAccountByIdQuery implements IQuery {
  constructor(
    public readonly params: LoadAccountByIdInput,
    public readonly payload: TokenPayload
  ) {}
}