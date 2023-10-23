// Dependencies
import { ICommand } from '@nestjs/cqrs'

// Domain Protocols
import { PromoteMemberInput } from '@/domain/protocols'

// Data Protocols
import { TokenPayload } from '@/data/protocols'

// Add account command
export class TransferOwnershipCommand implements ICommand {
  constructor(
    public readonly bandId: string,
    public readonly params: PromoteMemberInput,
    public readonly payload: TokenPayload
  ) {}
}