// Dependencies
import { HttpException, HttpStatus, Inject } from '@nestjs/common'
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs'

// Commands
import { LoadPendingShowsQuery } from '@/data/protocols'

// Repositories and Schemas
import { BandRepository, ShowRepository, AccountRepository } from '@/infra/db/mongodb'

// Domain Entities
import { Account, Band, Show } from '@/domain/entities'

@QueryHandler(LoadPendingShowsQuery)
export class LoadPendingShowsHandler implements IQueryHandler<LoadPendingShowsQuery> {
  // Dependencies injection
  constructor(
    private readonly showRepository: ShowRepository,
    @Inject('BandRepository') private readonly bandRepository: BandRepository,
    @Inject('AccountRepository') private readonly accountRepository: AccountRepository
  ) {}

  // Execute action handler
  async execute(command: LoadPendingShowsQuery): Promise<Show[]> {
    // Destruct params
    const { payload: { account } } = command

    // Step 1 - Retrieve account and band
    const currentAccount = await this.fetchAccount(account)
    if (!currentAccount) throw new HttpException(
      `Conta de id ${command.payload.account} não foi encontrada!`,
      HttpStatus.NOT_FOUND
    )

    // Step 2 - Retrieve account bands
    const bands = await this.fetchBands(currentAccount)
    if (!bands.length) return []    

    // Retrieve band shows
    const shows = await this.fetchShow(bands.map(b => b._id.toString()))
    return shows
  }

  // Fetch account from database
  async fetchAccount(id: string): Promise<Account | null> {
    const r = await this.accountRepository.findOne({ id })
    return r
  }

  // Fetch band from database
  async fetchBands(account: Account): Promise<Band[] | null> {
    const { _id } = account
    const r = await this.bandRepository.find(
      { members: _id.toString() },
      { offset: 0, limit: 0 }
    )
    return r
  }

  // Fetch shows
  async fetchShow(ids: string[]): Promise<Show[]> {
    const r = await this.showRepository.findPendingPopulated(ids)
    return r
  }
}
