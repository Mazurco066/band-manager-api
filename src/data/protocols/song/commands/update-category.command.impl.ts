// Dependencies
import { ICommand } from '@nestjs/cqrs'

// Domain Protocols
import { UpdateCategoryInput } from '@/domain/protocols'

// Data Protocols
import { TokenPayload } from '@/data/protocols'

// Add account command
export class UpdateCategoryCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly params: UpdateCategoryInput,
    public readonly payload: TokenPayload
  ) {}
}