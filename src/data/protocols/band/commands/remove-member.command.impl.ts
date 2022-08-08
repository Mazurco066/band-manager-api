// Dependencies
import { ICommand } from '@nestjs/cqrs'

// Domain Protocols
import { RemoveMemberInput } from '@/domain/protocols'

// Data Protocols
import { TokenPayload } from '@/data/protocols'

// Add account command
export class RemoveMemberCommand implements ICommand {
  constructor(
    public readonly bandId: string,
    public readonly params: RemoveMemberInput,
    public readonly payload: TokenPayload
  ) {}
}