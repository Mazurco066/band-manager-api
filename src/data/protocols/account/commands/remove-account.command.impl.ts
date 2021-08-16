// Dependencies
import { ICommand } from '@nestjs/cqrs'

// Domain Protocols
import { RemoveAccountByIdInput } from '@/domain/protocols'

// Data Protocols
import { TokenPayload } from '@/data/protocols'

// Add account command
export class RemoveAccountCommand implements ICommand {
  constructor(
    public readonly params: RemoveAccountByIdInput,
    public readonly payload: TokenPayload
  ) {}
}