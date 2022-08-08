// Dependencies
import { ICommand } from '@nestjs/cqrs'

// Domain Protocols
import { UpdateObservationInput } from '@/domain/protocols'

// Data Protocols
import { TokenPayload } from '@/data/protocols'

// Update observation command
export class UpdateObservationCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly showId: string,
    public readonly params: UpdateObservationInput,
    public readonly payload: TokenPayload
  ) {}
}
