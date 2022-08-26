// Dependencies
import { HttpException, HttpStatus } from '@nestjs/common'
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs'

// Commands
import { ListAccountsQuery } from '@/data/protocols'

// Domain Entities
import { Account } from '@/domain/entities'

// Repositories
import { AccountRepository } from 'infra/db/mongodb'

@QueryHandler(ListAccountsQuery)
export class ListAccountsHandler implements IQueryHandler<ListAccountsQuery> {
  // Dependencies injection
  constructor(
    private readonly accountRepository: AccountRepository
  ) {}

  // Execute action handler
  async execute(command: ListAccountsQuery): Promise<Account[]> {
    // Step 01 - Fetch signed accounts
    const signedUpAccounts = await this.fetchAccounts(command)
    return signedUpAccounts
  }

  // Fetch account from database
  async fetchAccounts(command: ListAccountsQuery): Promise<Account[] | null> {
    const { params: { limit = '0', offset = '0' } } = command
    const accounts = await this.accountRepository.findPaginated({}, {
      limit: parseInt(limit.toString()),
      offset: parseInt(offset.toString()) 
    })
    return accounts
  }
}
