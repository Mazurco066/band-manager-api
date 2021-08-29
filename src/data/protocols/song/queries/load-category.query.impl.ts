// Dependencies
import { IQuery } from '@nestjs/cqrs'

// Domain Protocols
import { LoadCategoryByIdInput } from '@/domain/protocols'

// Data Protocols
import { TokenPayload } from '@/data/protocols'

// Add account command
export class LoadCategoryQuery implements IQuery {
  constructor(
    public readonly params: LoadCategoryByIdInput,
    public readonly payload: TokenPayload
  ) {}
}