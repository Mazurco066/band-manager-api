// Dependencies
import { ICommand } from '@nestjs/cqrs'

// Domain Protocols
import { UpdateSongInput } from '@/domain/protocols'

// Data Protocols
import { TokenPayload } from '@/data/protocols'

// Add account command
export class UpdateSongCommand implements ICommand {
  constructor(
    public readonly params: UpdateSongInput,
    public readonly payload: TokenPayload
  ) {}
}