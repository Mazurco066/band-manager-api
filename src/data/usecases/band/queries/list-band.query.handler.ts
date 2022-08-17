// Dependencies
import { HttpException, HttpStatus, Inject } from '@nestjs/common'
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs'

// Commands
import { ListBandsQuery } from '@/data/protocols'

// Domain Entities
import { Account, Band } from '@/domain/entities'

// Repositories
import { AccountRepository, BandRepository } from 'infra/db/mongodb'

@QueryHandler(ListBandsQuery)
export class ListBandsHandler implements IQueryHandler<ListBandsQuery> {
  // Dependencies injection
  constructor(
    private readonly bandRepository: BandRepository,
    @Inject('AccountRepository') private readonly accountRepository: AccountRepository
  ) {}

  // Execute action handler
  async execute(command: ListBandsQuery): Promise<Band[]> {

    // Step 1 - Search for user account
    const retrievedAccount = await this.fetchAccount(command)
    if (!retrievedAccount) throw new HttpException(
      `Conta de id ${command.payload.account} não foi encontrada!`,
      HttpStatus.NOT_FOUND
    )

    // Step 2 - Retrieve user bands
    const bands = await this.fetchBands(command, retrievedAccount)

    // Returning
    return bands
  }

  // Fetch account
  async fetchAccount(command: ListBandsQuery): Promise<Account> {
    const { payload: { account } } = command
    const r = await this.accountRepository.findOne({ id: account })
    return r
  }

  // Fetch band from database
  async fetchBands(command: ListBandsQuery, account: Account): Promise<Band[] | null> {
    const { params: { limit, offset } } = command
    const { _id } = account
    const r = await this.bandRepository.find({
      members: _id.toString()
    }, {
      offset: typeof offset === 'string' ? parseInt(offset) : offset,
      limit: typeof limit === 'string' ? parseInt(limit) : limit
    })
    return r
  }
}
