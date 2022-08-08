// Dependencies
import { ICommand } from '@nestjs/cqrs'

// Data Protocols
import { TokenPayload } from '@/data/protocols'

// Add account command
export class RemoveSongCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly payload: TokenPayload
  ) {}
}