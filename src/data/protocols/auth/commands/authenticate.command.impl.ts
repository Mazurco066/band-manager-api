// Dependencies
import { ICommand } from '@nestjs/cqrs'

// Domain Protocols
import { AuthenticateInput } from '@/domain/protocols'

// Add account command
export class AuthenticateCommand implements ICommand {
  constructor(
    public readonly params: AuthenticateInput
  ) {}
}