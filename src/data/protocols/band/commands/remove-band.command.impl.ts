// Dependencies
import { ICommand } from '@nestjs/cqrs'

// Domain Protocols
import { RemoveBandByIdInput } from '@/domain/protocols'

// Data Protocols
import { TokenPayload } from '@/data/protocols'

// Add account command
export class RemoveBandCommand implements ICommand {
  constructor(
    public readonly params: RemoveBandByIdInput,
    public readonly payload: TokenPayload
  ) {}
}