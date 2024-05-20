// Dependencies
import { IQuery } from '@nestjs/cqrs'

// Add account command
export class LoadPublicSongQuery implements IQuery {
  constructor(
    public readonly id: string,
  ) {}
}