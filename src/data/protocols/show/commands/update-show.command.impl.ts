// Dependencies
import { ICommand } from '@nestjs/cqrs'

// Domain Protocols
import { UpdateShowInput } from '@/domain/protocols'

// Data Protocols
import { TokenPayload } from '@/data/protocols'

// Update show command
export class UpdateShowCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly params: UpdateShowInput,
    public readonly payload: TokenPayload
  ) {}
}
