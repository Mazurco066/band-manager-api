// Dependencies
import { ICommand } from '@nestjs/cqrs'

// Data Protocols
import { TokenPayload } from '@/data/protocols'

// Verify account command
export class ResendVerificationCommand implements ICommand {
  constructor(
    public readonly payload: TokenPayload
  ) {}
}
