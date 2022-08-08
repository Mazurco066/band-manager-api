// Dependencies
import { ICommand } from '@nestjs/cqrs'

// Domain Protocols
import { AddObservationInput } from '@/domain/protocols'

// Data Protocols
import { TokenPayload } from '@/data/protocols'

// Add observation command
export class AddObservationCommand implements ICommand {
  constructor(
    public readonly showId: string,
    public readonly params: AddObservationInput,
    public readonly payload: TokenPayload
  ) {}
}
