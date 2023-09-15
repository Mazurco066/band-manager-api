// Dependencies
import { HttpException, HttpStatus, Inject } from '@nestjs/common'
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs'

// Commands
import { ListSongsByCategoryQuery } from '@/data/protocols'

// Repositories and Schemas
import { BandRepository, SongRepository, AccountRepository, CategoryRepository } from '@/infra/db/mongodb'

// Domain Entities
import { Account, Band, Category, Song } from '@/domain/entities'

// Domain Protocols
import { RoleEnum } from '@/domain/protocols'

@QueryHandler(ListSongsByCategoryQuery)
export class ListSongsbyCategoryHandler implements IQueryHandler<ListSongsByCategoryQuery> {
  // Dependencies injection
  constructor(
    private readonly songRepository: SongRepository,
    private readonly categoryRepository: CategoryRepository,
    @Inject('BandRepository') private readonly bandRepository: BandRepository,
    @Inject('AccountRepository') private readonly accountRepository: AccountRepository
  ) {}

  // Execute action handler
  async execute(command: ListSongsByCategoryQuery): Promise<{
    limit: number,
    offset: number,
    total: number,
    data: Song[]
  }> {
    // Destruct params
    const {
      params: { limit = '0', offset = '0' },
      bandId,
      categoryId,
      payload: { account }
    } = command

    // Step 1 - Retrieve current Account and category
    const [
      currentAccount,
      currentBand,
      currentCategory,
    ] = await Promise.all([
      this.fetchAccount(account),
      this.fetchBand(bandId),
      this.fetchCategory(categoryId)
    ])

    // Validate data
    if (!currentAccount) throw new HttpException(
      `Conta de id ${account} não encontrada!`,
      HttpStatus.NOT_FOUND
    )
    if (!currentBand) throw new HttpException(
      `Banda de id ${bandId} não foi encontrada!`,
      HttpStatus.NOT_FOUND
    )
    if (!currentCategory) throw new HttpException(
      `Categoria de id ${bandId} não foi encontrada!`,
      HttpStatus.NOT_FOUND
    )

    // Step 3 - Validate Role and membership
    this.validateRole(command, currentBand, currentAccount)

    // Step 4 - Load songs from a band
    const [ songs, total ] = await Promise.all([
      this.listSongs(command, currentBand, currentCategory),
      this.countSongs(currentBand, currentCategory)
    ])

    // Return
    return {
      limit: Number(limit),
      offset: Number(offset),
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

  // Fetch category from database
  async fetchCategory(id: string): Promise<Category | null> {
    const r = await this.categoryRepository.findOne({ id })
    return r
  }

  // Validates if is user is master
  validateRole(command: ListSongsByCategoryQuery, band: Band, account: Account): void {
    const { payload: { role } } = command
    const { owner, members } = band
    if (
      role === RoleEnum.player &&
      account._id.toString() !== owner &&
      !members.includes(account._id.toString())
    ) {
      throw new HttpException(
        `Você não tem permissão como ${RoleEnum.player} para listar músicas dessa banda!`,
        HttpStatus.FORBIDDEN
      )
    }
  }

  // Lists songs from a band
  async listSongs(command: ListSongsByCategoryQuery, band: Band, category: Category): Promise<Song[] | null> {
    const { params: { offset = '0', limit = '0' } } = command
    const r = await this.songRepository.findPopulated(
      {
        band: band._id.toString(),
        category: category._id.toString()
      },
      {
        offset: parseInt(offset.toString()),
        limit: parseInt(limit.toString())
      }
    )
    return r
  }

  // Count songs
  async countSongs(band: Band, category: Category): Promise<number> {
    return await this.songRepository.countByCategory(
      band._id.toString(),
      category._id.toString()
    )
  }
}