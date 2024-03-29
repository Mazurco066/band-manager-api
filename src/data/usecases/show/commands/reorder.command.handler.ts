// Dependencies
import { HttpException, HttpStatus, Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

// Commands
import { ReorderShowCommand } from '@/data/protocols'

// Repositories and Schemas
import { BandRepository, ShowRepository, AccountRepository, SongRepository } from '@/infra/db/mongodb'

// Domain Entities
import { Account, Band, Show, Song } from '@/domain/entities'

// Domain Protocols
import { RoleEnum } from '@/domain/protocols'

@CommandHandler(ReorderShowCommand)
export class ReorderShowHandler implements ICommandHandler<ReorderShowCommand> {
  // Dependencies injection
  constructor(
    private readonly showRepository: ShowRepository,
    @Inject('SongRepository') private readonly songRepository: SongRepository,
    @Inject('BandRepository') private readonly bandRepository: BandRepository,
    @Inject('AccountRepository') private readonly accountRepository: AccountRepository
  ) {}

  // Execute action handler
  async execute(command: ReorderShowCommand): Promise<Show> {
    // Destruct params
    const { id, params: { songs }, payload: { account } } = command

    // Step 1 - Retrieve current Account and show
    const [ currentAccount, currentShow ] = await Promise.all([
      this.fetchAccount(account),
      this.fetchShow(command)
    ])
    if (!currentAccount) throw new HttpException(
      `Conta de id ${account} não encontrada!`,
      HttpStatus.NOT_FOUND
    )
    if (!currentShow) throw new HttpException(
      `Apresentação de id ${id} não encontrada!`,
      HttpStatus.NOT_FOUND
    )

    // Step 3 - Retrieve band
    const currentBand = await this.fetchBand(currentShow)
    if (!currentBand) throw new HttpException(
      `Banda na qual a apresentação está vinculada não foi encontrada!`,
      HttpStatus.NOT_FOUND
    )

    // Step 4 - Validate Role and membership
    this.validateRole(command, currentBand, currentAccount)

    // Step 5 - Fetch songs
    const showSongs = await this.fetchSongs(songs)
    if (showSongs.includes(null))
      throw new HttpException(
        `Algumas das músicas informadas não se encontram no banco de dados!`,
        HttpStatus.BAD_REQUEST
      )

    // Step 6 - Update song
    const updatedShow = await this.updateShow(command, showSongs)
    if (!updatedShow) throw new HttpException(
      `Ocorreu um erro ao reodenar as músicas do show informado!`,
      HttpStatus.INTERNAL_SERVER_ERROR
    )

    // Step 4 - Add member to band
    return updatedShow
  }

  // Fetch account from database
  async fetchAccount(id: string): Promise<Account | null> {
    const r = await this.accountRepository.findOne({ id })
    return r
  }

  // Fetch show from database
  async fetchShow(command: ReorderShowCommand): Promise<Show | null> {
    const { id } = command
    const r = await this.showRepository.findOne({ id })
    return r
  }

  // Fetch band from database
  async fetchBand(show: Show): Promise<Band | null> {
    const { band } = show
    const r = await this.bandRepository.findOne({ _id: band })
    return r
  }

  // Validates if is user is master
  validateRole(command: ReorderShowCommand, band: Band, account: Account): void {
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

  // Fetch songs
  async fetchSongs(songs: string[]): Promise<string[] | null> {
    const promises = await Promise.all(
      songs.map(songId => this.songRepository.findOne({ id: songId }))
    )
    return promises.map((p: any) => p ? p._id.toString() : null)
  }

  // Update show
  async updateShow(command: ReorderShowCommand, songs: string[]): Promise<Show | null> {
    const { id } = command
    const payload = { songs }
    const r = await this.showRepository.update(payload, id)
    return r
  }
}
