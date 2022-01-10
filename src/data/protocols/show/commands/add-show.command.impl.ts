// Dependencies
import { ICommand } from '@nestjs/cqrs'

// Domain Protocols
import { AddShowInput } from '@/domain/protocols'

// Data Protocols
import { TokenPayload } from '@/data/protocols'

// Add show command
export class AddShowCommand implements ICommand {
  constructor(
    public readonly params: AddShowInput,
    public readonly payload: TokenPayload
  ) {}
}
