// Dependencies
import { HttpException, HttpStatus } from '@nestjs/common'
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs'

// Commands
import { LoadMeQuery } from '@/data/protocols'

// Domain Entities
import { Account } from '@/domain/entities'

// Repositories
import { AccountRepository } from 'infra/db/mongodb'

@QueryHandler(LoadMeQuery)
export class LoadMeHandler implements IQueryHandler<LoadMeQuery> {
  // Dependencies injection
  constructor(
    private readonly accountRepository: AccountRepository
  ) {}

  // Execute action handler
  async execute(command: LoadMeQuery): Promise<Account> {
    // Step 01 - Search for account into database
    const account = await this.fetchAccount(command)
    if (!account) throw new HttpException(
      `Conta de id ${command.payload.account} não foi encontrada!`,
      HttpStatus.NOT_FOUND
    )

    // Returning
    return account
  }

  // Fetch account from database
  async fetchAccount(command: LoadMeQuery): Promise<Account | null> {
    const { payload: { account: id } } = command
    const account = await this.accountRepository.findOne({ id })
    return account
  }
}
