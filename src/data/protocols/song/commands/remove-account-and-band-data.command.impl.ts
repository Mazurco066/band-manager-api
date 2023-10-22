// Dependencies
import { ICommand } from '@nestjs/cqrs'

// Data Protocols
import { TokenPayload } from '@/data/protocols'

// Add account command
export class RemoveAccountAndBandDataCommand implements ICommand {
  constructor(
    public readonly payload: TokenPayload
  ) {}
}