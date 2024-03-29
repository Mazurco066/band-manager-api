// Dependencies
import { IQuery } from '@nestjs/cqrs'

// Data Protocols
import { TokenPayload } from '@/data/protocols'

// Add account command
export class LoadSongQuery implements IQuery {
  constructor(
    public readonly id: string,
    public readonly payload: TokenPayload
  ) {}
}