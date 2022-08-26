// Dependencies
import { IQuery } from '@nestjs/cqrs'

// Domain Protocols
import { ListAccountsInput } from '@/domain/protocols'

// Data Protocols
import { TokenPayload } from '@/data/protocols'

// List Accounts Command
export class ListAccountsQuery implements IQuery {
  constructor(
    public readonly params: ListAccountsInput,
    public readonly payload: TokenPayload
  ) {}
}
