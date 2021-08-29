// Dependencies
import { IQuery } from '@nestjs/cqrs'

// Domain Protocols
import { ListCategoriesInput } from '@/domain/protocols'

// Data Protocols
import { TokenPayload } from '@/data/protocols'

// Add account command
export class ListCategoriesQuery implements IQuery {
  constructor(
    public readonly params: ListCategoriesInput,
    public readonly payload: TokenPayload
  ) {}
}