// Dependencies
import { ICommand } from '@nestjs/cqrs'

// Domain Protocols
import { RemoveSongByIdInput } from '@/domain/protocols'

// Data Protocols
import { TokenPayload } from '@/data/protocols'

// Add account command
export class RemoveSongCommand implements ICommand {
  constructor(
    public readonly params: RemoveSongByIdInput,
    public readonly payload: TokenPayload
  ) {}
}