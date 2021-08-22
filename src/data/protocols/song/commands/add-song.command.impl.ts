// Dependencies
import { ICommand } from '@nestjs/cqrs'

// Domain Protocols
import { AddSongInput } from '@/domain/protocols'

// Data Protocols
import { TokenPayload } from '@/data/protocols'

// Add account command
export class AddSongCommand implements ICommand {
  constructor(
    public readonly params: AddSongInput,
    public readonly payload: TokenPayload
  ) {}
}