// Dependencies
import { ICommand } from '@nestjs/cqrs'

// Domain Protocols
import { AddBandInput } from '@/domain/protocols'

// Data Protocols
import { TokenPayload } from '@/data/protocols'

// Add account command
export class AddBandCommand implements ICommand {
  constructor(
    public readonly params: AddBandInput,
    public readonly payload: TokenPayload
  ) {}
}