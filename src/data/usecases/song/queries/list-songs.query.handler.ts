// Dependencies
import { Inject } from '@nestjs/common'
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs'
import { ApolloError } from 'apollo-server-express'

// Commands
import { ListSongsQuery } from '@/data/protocols'

// Repositories and Schemas
import { BandRepository, SongRepository, AccountRepository } from '@/infra/db/mongodb'

// Domain Entities
import { Account, Band, Song } from '@/domain/entities'
import { BandSongsType } from '@/domain/protocols'

// Domain Protocols
import { RoleEnum } from '@/domain/protocols'

@QueryHandler(ListSongsQuery)
export class ListSongsHandler implements IQueryHandler<ListSongsQuery> {
  // Dependencies injection
  constructor(
    private readonly songRepository: SongRepository,
    @Inject('BandRepository') private readonly bandRepository: BandRepository,
    @Inject('AccountRepository') private readonly accountRepository: AccountRepository
  ) {}

  // Execute action handler
  async execute(command: ListSongsQuery): Promise<BandSongsType> {
    // Destruct params
    const { params: { bandId }, payload: { account } } = command

    // Step 1 - Retrieve current Account
    const currentAccount = await this.fetchAccount(account)
    if (!currentAccount) throw new ApolloError(`Conta de id ${account} não encontrada!`)

    // Step 2 - Retrieve band
    const currentBand = await this.fetchBand(bandId)
    if (!currentBand) throw new ApolloError(`Banda de id ${bandId} não foi encontrada!`)

    // Step 3 - Validate Role and membership
    this.validateRole(command, currentBand, currentAccount)

    // Step 4 - Load songs from a band
    const [ songs, total ] = await Promise.all([
      this.listSongs(command, currentBand),
      this.countSongs(command, currentBand)
    ])

    // Return
    return {
      total: total,
      data: songs
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
  validateRole(command: ListSongsQuery, band: Band, account: Account): void {
    const { payload: { role } } = command
    const { owner, members } = band
    if (
      role === RoleEnum.player &&
      account._id.toString() !== owner &&
      !members.includes(account._id.toString())
    ) {
      throw new ApolloError(`Você não tem permissão como ${RoleEnum.player} para listar músicas dessa banda!`)
    }
  }

  // Lists songs from a band
  async listSongs(command: ListSongsQuery, band: Band): Promise<Song[] | null> {
    const { params: { offset = 0, limit = 0, filter = '' } } = command
    const r = await this.songRepository.findFilteredPopulated(
      band._id.toString(),
      filter,
      { offset, limit }
    )
    return r
  }

  // Count songs
  async countSongs(command: ListSongsQuery, band: Band): Promise<number> {
    const { params: { filter = '' } } = command
    return await this.songRepository.customCount(band._id.toString(), filter)
  }
}