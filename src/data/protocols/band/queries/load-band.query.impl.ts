// Dependencies
import { IQuery } from '@nestjs/cqrs'

// Domain Protocols
import { LoadBandByIdInput } from '@/domain/protocols'

// Data Protocols
import { TokenPayload } from '@/data/protocols'

// Load Account Command
export class LoadBandByIdQuery implements IQuery {
  constructor(
    public readonly params: LoadBandByIdInput,
    public readonly payload: TokenPayload
  ) {}
}