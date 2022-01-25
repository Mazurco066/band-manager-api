// Dependencies
import { IQuery } from '@nestjs/cqrs'

// Domain Protocols
import { LoadAccountByEmailInput } from '@/domain/protocols'

// Data Protocols
import { TokenPayload } from '@/data/protocols'

// Load Account Command
export class LoadAccountByEmailQuery implements IQuery {
  constructor(
    public readonly params: LoadAccountByEmailInput,
    public readonly payload: TokenPayload
  ) {}
}
