// Dependencies
import { ICommand } from '@nestjs/cqrs'

// Domain Protocols
import { LinkSongInput } from '@/domain/protocols'

// Data Protocols
import { TokenPayload } from '@/data/protocols'

// Link song command
export class LinkSongCommand implements ICommand {
  constructor(
    public readonly showId: string,
    public readonly params: LinkSongInput,
    public readonly payload: TokenPayload
  ) {}
}
