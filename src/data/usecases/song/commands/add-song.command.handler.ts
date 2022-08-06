// Dependencies
import { HttpException, HttpStatus, Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

// Commands
import { AddSongCommand } from '@/data/protocols'

// Repositories and Schemas
import { BandRepository, AccountRepository, SongRepository, CategoryRepository } from '@/infra/db/mongodb'

// Domain Entities
import { Account, Band, Song, Category } from '@/domain/entities'

@CommandHandler(AddSongCommand)
export class AddSongHandler implements ICommandHandler<AddSongCommand> {
  // Dependencies injection
  constructor(
    private readonly songRepository: SongRepository,
    private readonly categoryRepository: CategoryRepository,
    @Inject('BandRepository') private readonly bandRepository: BandRepository,
    @Inject('AccountRepository') private readonly accountRepository: AccountRepository
  ) {}

  // Execute action handler
  async execute(command: AddSongCommand): Promise<Song> {
    // Destruct params
    const { params: { band: bandId, category: categoryId } } = command

    // Step 1 - Get authenticated account
    const account = await this.fetchAccount(command)
    if (!account) throw new HttpException(
      `Conta de id ${command.payload.account} não foi encontrada!`,
      HttpStatus.NOT_FOUND
    )

    // Step 2 - Get desired band
    const band = await this.fetchBand(command)
    if (!band) throw new HttpException(
      `Band de id ${bandId} não encontrada!`,
      HttpStatus.NOT_FOUND
    )

    // Step 3 - Get desired category
    const category = await this.fetchCategory(command)
    if (!category) throw new HttpException(
      `Categoria de id ${categoryId} não encontrada!`,
      HttpStatus.NOT_FOUND
    )

    // Step 4 - Create song
    return await this.createSong(command, band, category)
  }

  // Fetch account from database
  async fetchAccount(command: AddSongCommand): Promise<Account | null> {
    const { payload: { account: id } } = command
    const account = await this.accountRepository.findOne({ id })
    return account
  }

  // Fetch band from database
  async fetchBand(command: AddSongCommand): Promise<Band | null> {
    const { params: { band } } = command
    const r = await this.bandRepository.findOne({ id: band })
    return r
  }

  // Fetch category from database
  async fetchCategory(command: AddSongCommand): Promise<Category | null> {
    const { params: { category } } = command
    const r = await this.categoryRepository.findOne({ id: category })
    return r
  }

  // Creates song into database
  async createSong(command: AddSongCommand, band: Band, category: Category): Promise<Song | null> {
    const { _id  } = band
    const { _id: _cid } = category
    const { params } = command
    const r = await this.songRepository.save({ 
      ...params, 
      band: _id.toString(),
      category: _cid.toString()
    })
    return r
  }
}