// Dependencies
import { ICommand } from '@nestjs/cqrs'

// Domain Protocols
import { UpdateBandInput } from '@/domain/protocols'

// Data Protocols
import { TokenPayload } from '@/data/protocols'

// Add account command
export class UpdateBandCommand implements ICommand {
  constructor(
    public readonly params: UpdateBandInput,
    public readonly payload: TokenPayload
  ) {}
}