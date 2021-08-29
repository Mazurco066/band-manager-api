// Dependencies
import { ICommand } from '@nestjs/cqrs'

// Domain Protocols
import { AddCategoryInput } from '@/domain/protocols'

// Data Protocols
import { TokenPayload } from '@/data/protocols'

// Add account command
export class AddCategoryCommand implements ICommand {
  constructor(
    public readonly params: AddCategoryInput,
    public readonly payload: TokenPayload
  ) {}
}