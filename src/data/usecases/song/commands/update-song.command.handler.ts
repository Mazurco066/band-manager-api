// Dependencies
import { HttpException, HttpStatus, Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

// Commands
import { UpdateSongCommand } from '@/data/protocols'

// Repositories and Schemas
import { BandRepository, SongRepository, AccountRepository, CategoryRepository } from '@/infra/db/mongodb'

// Domain Entities
import { Account, Band, Song, Category } from '@/domain/entities'

// Domain Protocols
import { RoleEnum } from '@/domain/protocols'

@CommandHandler(UpdateSongCommand)
export class UpdateSongHandler implements ICommandHandler<UpdateSongCommand> {
  // Dependencies injection
  constructor(
    private readonly songRepository: SongRepository,
    private readonly categoryRepository: CategoryRepository,
    @Inject('BandRepository') private readonly bandRepository: BandRepository,
    @Inject('AccountRepository') private readonly accountRepository: AccountRepository
  ) {}

  // Execute action handler
  async execute(command: UpdateSongCommand): Promise<Song> {
    // Destruct params
    const { params: { id, category }, payload: { account } } = command

    // Step 1 - Retrieve current Account, cateogry and song
    const [ currentAccount, currentSong, currentCategory ] = await Promise.all([
      this.fetchAccount(account),
      this.fetchSong(command),
      this.fetchCategory(command)
    ])

    // Step 2 - Validate retrieved data
    if (!currentAccount) throw new HttpException(
      `Conta de id ${account} não encontrada!`,
      HttpStatus.NOT_FOUND
    )
    if (!currentSong) throw new HttpException(
      `Música de id ${id} não encontrada!`,
      HttpStatus.NOT_FOUND
    )
    if (category && !currentCategory) throw new HttpException(
      `Categoria de id ${category} não encontrada!`,
      HttpStatus.NOT_FOUND
    )

    // Step 3 - Retrieve band
    const currentBand = await this.fetchBand(currentSong)
    if (!currentBand) throw new HttpException(
      `Banda na qual a música está vinculada não foi encontrada!`,
      HttpStatus.NOT_FOUND
    )

    // Step 4 - Validate Role and membership
    this.validateRole(command, currentBand, currentAccount)

    // Step 4 - Add member to band
    return await this.updateSong(command, currentCategory)
  }

  // Fetch account from database
  async fetchAccount(id: string): Promise<Account | null> {
    const r = await this.accountRepository.findOne({ id })
    return r
  }

  // Fetch song from database
  async fetchSong(command: UpdateSongCommand): Promise<Song | null> {
    const { params: { id } } = command
    const r = await this.songRepository.findOne({ id })
    return r
  }

  // Fetch band from database
  async fetchBand(song: Song): Promise<Band | null> {
    const { band } = song
    const r = await this.bandRepository.findOne({ _id: band })
    return r
  }

  // Fetch category from database
  async fetchCategory(command: UpdateSongCommand): Promise<Category | null> {
    const { params: { category } } = command
    const r = category
      ? await this.categoryRepository.findOne({ id: category })
      : null
    return r
  }

  // Validates if is user is master
  validateRole(command: UpdateSongCommand, band: Band, account: Account): void {
    const { payload: { role } } = command
    const { owner, admins } = band
    if (
      role === RoleEnum.player &&
      account._id.toString() !== owner &&
      !admins.includes(account._id.toString())
    ) {
      throw new HttpException(
        `Você não tem permissão como ${RoleEnum.player} para atualizar dados dessa música!`,
        HttpStatus.FORBIDDEN
      )
    }
  }

  // Updates song from band
  async updateSong(command: UpdateSongCommand, updatedCategory?: Category): Promise<Song | null> {
    const { params: { id, title, writter, body, category, isPublic, tone } } = command
    if (!title && !writter && !body && !category && !tone)
      throw new HttpException(
        'Nenhum dado foi informado para realizar a atualização da música!',
        HttpStatus.BAD_REQUEST
      )
    const payload = updatedCategory 
      ? { title, writter, body, tone, category: updatedCategory._id.toString() } 
      : {  title, writter, body, tone }
    if (isPublic !== undefined) payload['isPublic'] = isPublic
    const r = await this.songRepository.update(payload, id)
    return r
  }
}
