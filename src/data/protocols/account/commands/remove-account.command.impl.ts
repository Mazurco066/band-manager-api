// Dependencies
import { ICommand } from '@nestjs/cqrs'

// Domain Protocols

// Data Protocols
import { TokenPayload } from '@/data/protocols'

// Add account command
export class RemoveAccountCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly payload: TokenPayload
  ) {}
}