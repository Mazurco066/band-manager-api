// Dependencies
import { ICommand } from '@nestjs/cqrs'

// Domain Protocols
import { AddMemberInput } from '@/domain/protocols'

// Data Protocols
import { TokenPayload } from '@/data/protocols'

// Add account command
export class AddMemberCommand implements ICommand {
  constructor(
    public readonly params: AddMemberInput,
    public readonly payload: TokenPayload
  ) {}
}