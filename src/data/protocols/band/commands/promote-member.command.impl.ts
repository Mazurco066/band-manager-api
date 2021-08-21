// Dependencies
import { ICommand } from '@nestjs/cqrs'

// Domain Protocols
import { PromoteMemberInput } from '@/domain/protocols'

// Data Protocols
import { TokenPayload } from '@/data/protocols'

// Add account command
export class PromoteMemberCommand implements ICommand {
  constructor(
    public readonly params: PromoteMemberInput,
    public readonly payload: TokenPayload
  ) {}
}