// Dependencies
import { IQuery } from '@nestjs/cqrs'

// Data Protocols
import { TokenPayload } from '@/data/protocols'

// Load Account Command
export class LoadBandByIdQuery implements IQuery {
  constructor(
    public readonly id: string,
    public readonly payload: TokenPayload
  ) {}
}