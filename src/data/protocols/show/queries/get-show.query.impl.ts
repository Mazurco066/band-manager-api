// Dependencies
import { IQuery } from '@nestjs/cqrs'

// Data Protocols
import { TokenPayload } from '@/data/protocols'

// List shows query
export class LoadShowQuery implements IQuery {
  constructor(
    public readonly id: string,
    public readonly bandId: string,
    public readonly payload: TokenPayload
  ) {}
}
