// Dependencies
import { ICommand } from '@nestjs/cqrs'

// Domain Protocols
import { CloneConcertInput } from '@/domain/protocols'

// Data Protocols
import { TokenPayload } from '@/data/protocols'

// Link song command
export class CloneConcertCommand implements ICommand {
  constructor(
    public readonly showId: string,
    public readonly params: CloneConcertInput,
    public readonly payload: TokenPayload
  ) {}
}
