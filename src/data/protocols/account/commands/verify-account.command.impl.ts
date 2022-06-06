// Dependencies
import { ICommand } from '@nestjs/cqrs'

// Domain Protocols
import { VerifyAccountInput } from '@/domain/protocols'

// Data Protocols
import { TokenPayload } from '@/data/protocols'

// Verify account command
export class VerifyAccountCommand implements ICommand {
  constructor(
    public readonly params: VerifyAccountInput,
    public readonly payload: TokenPayload
  ) {}
}
