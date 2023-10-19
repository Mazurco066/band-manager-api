// Dependencies
import { ICommand } from '@nestjs/cqrs'

// Data Protocols
import { TokenPayload } from '@/data/protocols'

// Deactivate account command
export class DeactivateAccountCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly payload: TokenPayload
  ) {}
}