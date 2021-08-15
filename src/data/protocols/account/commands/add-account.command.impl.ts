// Dependencies
import { ICommand } from '@nestjs/cqrs'

// Domain Protocols
import { AddAccountInput } from '@/domain/protocols'

// Add account command
export class AddAccountCommand implements ICommand {
  constructor(
    public readonly params: AddAccountInput
  ) {}
}