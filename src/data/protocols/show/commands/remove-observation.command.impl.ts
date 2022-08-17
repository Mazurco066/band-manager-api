// Dependencies
import { ICommand } from '@nestjs/cqrs'

// Data Protocols
import { TokenPayload } from '@/data/protocols'

// Remove observation command
export class RemoveObservationCommand implements ICommand {
  constructor(
    public readonly showId: string,
    public readonly observationId: string,
    public readonly payload: TokenPayload
  ) {}
}
