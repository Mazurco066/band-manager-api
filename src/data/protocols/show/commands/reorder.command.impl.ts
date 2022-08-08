// Dependencies
import { ICommand } from '@nestjs/cqrs'

// Domain Protocols
import { ReorderShowInput } from '@/domain/protocols'

// Data Protocols
import { TokenPayload } from '@/data/protocols'

// Reorder show command
export class ReorderShowCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly params: ReorderShowInput,
    public readonly payload: TokenPayload
  ) {}
}
