// Dependencies
import { HttpException, HttpStatus, Inject } from '@nestjs/common'
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs'

// Commands
import { ListShowsQueryV2 } from '@/data/protocols'

// Repositories and Schemas
import { BandRepository, ShowRepository, AccountRepository } from '@/infra/db/mongodb'

// Domain Entities
import { Account, Band, Show } from '@/domain/entities'

// Domain Protocols
import { RoleEnum } from '@/domain/protocols'

@QueryHandler(ListShowsQueryV2)
export class ListShowsHandlerV2 implements IQueryHandler<ListShowsQueryV2> {
  // Dependencies injection
  constructor(
    private readonly showRepository: ShowRepository,
    @Inject('BandRepository') private readonly bandRepository: BandRepository,
    @Inject('AccountRepository') private readonly accountRepository: AccountRepository
  ) {}

  // Execute action handler
  async execute(command: ListShowsQueryV2): Promise<{
    limit: number,
    offset: number,
    total: number,
    data: Show[]
  }> {
    // Destruct params
    const { bandId, params: { offset = '0', limit = '0' }, payload: { account } } = command

    // Step 1 - Retrieve current Account and band
    const [ currentAccount, currentBand ] = await Promise.all([
      this.fetchAccount(account),
      this.fetchBand(bandId)
    ])
    if (!currentAccount) throw new HttpException(
      `Conta de id ${account} não encontrada!`,
      HttpStatus.NOT_FOUND
    )
    if (!currentBand) throw new HttpException(
      `Banda de id ${bandId} não foi encontrada!`,
      HttpStatus.NOT_FOUND
    )

    // Step 3 - Validate Role and membership
    this.validateRole(command, currentBand, currentAccount)

    // Step 4 - Load songs from a band
    const [ shows, totalCount ] = await Promise.all([
      this.listShows(command, currentBand),
      this.countShows(command, currentBand)
    ])
    return {
      limit: Number(limit),
      offset: Number(offset),
      total: totalCount,
      data: shows
    }
  }

  // Fetch account from database
  async fetchAccount(id: string): Promise<Account | null> {
    const r = await this.accountRepository.findOne({ id })
    return r
  }

  // Fetch band from database
  async fetchBand(id: string): Promise<Band | null> {
    const r = await this.bandRepository.findOne({ id })
    return r
  }

  // Validates if is user is master
  validateRole(command: ListShowsQueryV2, band: Band, account: Account): void {
    const { payload: { role } } = command
    const { owner, members } = band
    if (
      role === RoleEnum.player &&
      account._id.toString() !== owner &&
      !members.includes(account._id.toString())
    ) {
      throw new HttpException(
        `Você não tem permissão como ${RoleEnum.player} para listar apresentações dessa banda!`,
        HttpStatus.FORBIDDEN
      )
    }
  }

  // Lists shows from a band
  async listShows(command: ListShowsQueryV2, band: Band): Promise<Show[] | null> {
    const { params: { offset = '0', limit = '0', filter = '' } } = command
    const r = await this.showRepository.findPopulatedWithoutSongs(
      { band: band._id.toString() },
      filter,
      { offset: parseInt(offset.toString()), limit: parseInt(limit.toString()) }
    )
    return r
  }

  // Count songs
  async countShows(command: ListShowsQueryV2, band: Band): Promise<number> {
    const { params: { filter = '' } } = command
    return await this.showRepository.countByBand(band._id.toString(), filter)
  }
}
