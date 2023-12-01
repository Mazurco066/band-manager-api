// Dependencies
import { IQuery } from '@nestjs/cqrs'

// Data Protocols
import { TokenPayload } from '@/data/protocols'

// Get liturgy color
export class GetLiturgyColorQuery implements IQuery {
  constructor(
    public readonly id: string,
    public readonly payload: TokenPayload
  ) {}
}
