// Dependencies
import { ICommand } from '@nestjs/cqrs'

// Domain Protocols
import { UnlinkSongInput } from '@/domain/protocols'

// Data Protocols
import { TokenPayload } from '@/data/protocols'

// Unlink song command
export class UnlinkSongCommand implements ICommand {
  constructor(
    public readonly showId: string,
    public readonly params: UnlinkSongInput,
    public readonly payload: TokenPayload
  ) {}
}
