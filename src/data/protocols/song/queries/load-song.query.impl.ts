// Dependencies
import { IQuery } from '@nestjs/cqrs'

// Domain Protocols
import { LoadSongByIdInput } from '@/domain/protocols'

// Data Protocols
import { TokenPayload } from '@/data/protocols'

// Add account command
export class LoadSongQuery implements IQuery {
  constructor(
    public readonly params: LoadSongByIdInput,
    public readonly payload: TokenPayload
  ) {}
}