// Dependencies
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs'
import { ApolloError } from 'apollo-server-express'

// Commands
import { LoadAccountByEmailQuery } from '@/data/protocols'

// Domain Entities
import { Account } from '@/domain/entities'

// Repositories
import { AccountRepository } from 'infra/db/mongodb'

@QueryHandler(LoadAccountByEmailQuery)
export class LoadAccountByEmailHandler implements IQueryHandler<LoadAccountByEmailQuery> {
  // Dependencies injection
  constructor(
    private readonly accountRepository: AccountRepository
  ) {}

  // Execute action handler
  async execute(command: LoadAccountByEmailQuery): Promise<Account> {

    // Step 1 - Search for account into database
    const account = await this.fetchAccount(command)
    if (!account) throw new ApolloError(`Conta de usuário ${command.params.username} não foi encontrada!`, '404')

    // Returning
    return account
  }

  // Fetch account from database
  async fetchAccount(command: LoadAccountByEmailQuery): Promise<Account | null> {
    const { params: { username } } = command
    const account = await this.accountRepository.findOne({ username })
    return account
  }
}
