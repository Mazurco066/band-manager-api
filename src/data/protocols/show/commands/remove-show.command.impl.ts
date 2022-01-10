// Dependencies
import { ICommand } from '@nestjs/cqrs'

// Domain Protocols
import { RemoveShowByIdInput } from '@/domain/protocols'

// Data Protocols
import { TokenPayload } from '@/data/protocols'

// Remove show command
export class RemoveShowCommand implements ICommand {
  constructor(
    public readonly params: RemoveShowByIdInput,
    public readonly payload: TokenPayload
  ) {}
}
