// Dependencies
import { HttpException, HttpStatus, Inject } from '@nestjs/common'
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs'

// Commands
import { ListShowsByAccountQuery } from '@/data/protocols'

// Repositories and Schemas
import { BandRepository, ShowRepository, AccountRepository } from '@/infra/db/mongodb'

// Domain Entities
import { Account, Band, Show } from '@/domain/entities'

@QueryHandler(ListShowsByAccountQuery)
export class ListShowsByAccountHandler implements IQueryHandler<ListShowsByAccountQuery> {
  // Dependencies injection
  constructor(
    private readonly showRepository: ShowRepository,
    @Inject('BandRepository') private readonly bandRepository: BandRepository,
    @Inject('AccountRepository') private readonly accountRepository: AccountRepository
  ) {}

  // Execute action handler
  async execute(command: ListShowsByAccountQuery): Promise<Show[]> {
    // Destruct params
    const { payload: { account } } = command

    // Step 1 - Retrieve current Account and band
    const currentAccount = await this.fetchAccount(account)
    if (!currentAccount) throw new HttpException(
      `Conta de id ${account} não encontrada!`,
      HttpStatus.NOT_FOUND
    )

    // Step 2 - Find user bands
    const accountBands = await this.fetchBands(currentAccount)
    if (!accountBands) return []

    // Step 3 - Find band playlists
    const accountShows = await this.fetchShows(accountBands)
    return accountShows || []
  }

  // Fetch account from database
  async fetchAccount(id: string): Promise<Account | null> {
    const r = await this.accountRepository.findOne({ id })
    return r
  }

  // Fetch bands
  async fetchBands(account: Account): Promise<Band[] | null> {
    const { _id } = account
    const r = await this.bandRepository.find(
      { members: _id.toString() },
      { offset: 0, limit: 0 }
    )
    return r
  }

  // Fetch shows
  async fetchShows(bands: Band[]): Promise<Show[] | null> {
    const ids = bands.map(b => b._id.toString())
    const r = await this.showRepository.findShowsByBandPopulated(ids, { offset: 0, limit: 0 })
    return r
  }
}
