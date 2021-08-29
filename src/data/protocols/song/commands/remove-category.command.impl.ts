// Dependencies
import { ICommand } from '@nestjs/cqrs'

// Domain Protocols
import { RemoveCategoryByIdInput } from '@/domain/protocols'

// Data Protocols
import { TokenPayload } from '@/data/protocols'

// Add account command
export class RemoveCategoryCommand implements ICommand {
  constructor(
    public readonly params: RemoveCategoryByIdInput,
    public readonly payload: TokenPayload
  ) {}
}