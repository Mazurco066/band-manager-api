// Dependencies
import { ICommand } from '@nestjs/cqrs'

// Domain Protocols
import { DemoteMemberInput } from '@/domain/protocols'

// Data Protocols
import { TokenPayload } from '@/data/protocols'

// Add account command
export class DemoteMemberCommand implements ICommand {
  constructor(
    public readonly params: DemoteMemberInput,
    public readonly payload: TokenPayload
  ) {}
}