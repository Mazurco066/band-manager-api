// Dependencies
import { ICommand } from '@nestjs/cqrs'

// Domain Protocols
import { RemoveObservationInput } from '@/domain/protocols'

// Data Protocols
import { TokenPayload } from '@/data/protocols'

// Remove observation command
export class RemoveObservationCommand implements ICommand {
  constructor(
    public readonly params: RemoveObservationInput,
    public readonly payload: TokenPayload
  ) {}
}
