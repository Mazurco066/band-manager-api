// Dependencies
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

// Commands
import { AddAccountCommand } from '@/data/protocols'

// Repositories and Schemas
import { AccountRepository } from '@/infra/db/mongodb'

// Domain Entities
import { Account } from '@/domain/entities'

@CommandHandler(AddAccountCommand)
export class AddAccountHandler implements ICommandHandler<AddAccountCommand> {
  // Dependencies injection
  constructor(
    private readonly accountRepository: AccountRepository
  ) {}

  // Execute action handler
  async execute(command: AddAccountCommand): Promise<Account> {
    return await this.createAccount(command)
  }

  // Create account handler
  async createAccount(command: AddAccountCommand): Promise<Account> {
    const { params } = command
    return await this.accountRepository.save({ ...params })
  }
}