// Dependencies
import { ICommand } from '@nestjs/cqrs'

// Domain Protocols
import { RespondInviteInput } from '@/domain/protocols'

// Data Protocols
import { TokenPayload } from '@/data/protocols'

// Respond invite command
export class RespondInviteCommand implements ICommand {
  constructor(
    public readonly params: RespondInviteInput,
    public readonly payload: TokenPayload
  ) {}
}
