// Dependencies
import { ICommand } from '@nestjs/cqrs'

// Domain Protocols
import { ScrapSongInput } from '@/domain/protocols'

// Data Protocols
import { TokenPayload } from '@/data/protocols'

// Scrap song command
export class ScrapSongCommand implements ICommand {
  constructor(
    public readonly params: ScrapSongInput,
    public readonly payload: TokenPayload
  ) {}
}
