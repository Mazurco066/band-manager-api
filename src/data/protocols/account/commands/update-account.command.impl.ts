// Dependencies
import { ICommand } from '@nestjs/cqrs'

// Domain Protocols
import { UpdateAccountInput } from '@/domain/protocols'

// Data Protocols
import { TokenPayload } from '@/data/protocols'

// Add account command
export class UpdateAccountCommand implements ICommand {
  constructor(
    public readonly params: UpdateAccountInput,
    public readonly payload: TokenPayload
  ) {}
}