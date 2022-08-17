// Dependencies
import { HttpException, HttpStatus, Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

// Commands
import { LinkSongCommand } from '@/data/protocols'

// Repositories and Schemas
import { BandRepository, AccountRepository, ShowRepository, SongRepository } from '@/infra/db/mongodb'

// Domain Entities
import { Account, Band, Show, Song } from '@/domain/entities'

// Domain Protocols
import { RoleEnum } from '@/domain/protocols'

@CommandHandler(LinkSongCommand)
export class LinkSongHandler implements ICommandHandler<LinkSongCommand> {
  // Dependencies injection
  constructor(
    private readonly showRepository: ShowRepository,
    private readonly songRepository: SongRepository,
    @Inject('BandRepository') private readonly bandRepository: BandRepository,
    @Inject('AccountRepository') private readonly accountRepository: AccountRepository
  ) {}

  // Execute action handler
  async execute(command: LinkSongCommand): Promise<Show> {
    // Destruct params
    const { showId, params: { songId }, payload: { account } } = command

    // Step 1 - Retrieve account 
    const [ currentAccount, currentSong, currentShow ] = await Promise.all([
      this.fetchAccount(account),
      this.fetchSong(command),
      this.fetchShow(command)
    ])
    if (!currentAccount) throw new HttpException(
      `Conta de id ${account} não encontrada`,
      HttpStatus.NOT_FOUND
    )
    if (!currentSong) throw new HttpException(
      `Música de id ${songId} não encontrada`,
      HttpStatus.NOT_FOUND
    )
    if (!currentShow) throw new HttpException(
      `Apresentação de id ${showId} não encontrada`,
      HttpStatus.NOT_FOUND
    )

    // Step 2 - Retrieve band
    const retrievedBand = await this.fetchBand(currentShow)
    if (!retrievedBand) throw new HttpException(
      `Banda não encontrada!`,
      HttpStatus.NOT_FOUND
    )

    // Step 3 - Validate Role and song
    this.validateRole(command, retrievedBand, currentAccount)
    this.validateSong(currentShow, currentSong)

    // Step 4 - Add song to show
    return await this.addSong(currentShow, currentSong)
  }

  // Fetch account from database
  async fetchAccount(id: string): Promise<Account | null> {
    const account = await this.accountRepository.findOne({ id })
    return account
  }

  // Fetch band from database
  async fetchBand(show: Show): Promise<Band | null> {
    const { band: bandId } = show
    const band = await this.bandRepository.findOne({ _id: bandId.toString() })
    return band
  }

  // Fetch show from database
  async fetchShow(command: LinkSongCommand): Promise<Show | null> {
    const { showId } = command
    const r = await this.showRepository.findOne({ id: showId })
    return r
  }

  // Fetch show from database
  async fetchSong(command: LinkSongCommand): Promise<Song | null> {
    const { params: { songId } } = command
    const r = await this.songRepository.findOne({ id: songId })
    return r
  }

  // Validates if is user is master
  validateRole(command: LinkSongCommand, band: Band, account: Account): void {
    const { payload: { role } } = command
    const { owner, admins } = band
    if (
      role === RoleEnum.player &&
      account._id.toString() !== owner &&
      !admins.includes(account._id.toString())
    ) {
      throw new HttpException(
        `Você não tem permissão como ${RoleEnum.player} para atualizar dados de apresentações dessa banda!`,
        HttpStatus.FORBIDDEN
      )
    }
  }

  // Validates if song is already on show
  validateSong(show: Show, song: Song): void {
    const { songs } = show
    const { _id: id, id: songId } = song
    if (songs.includes(id.toString())) {
      throw new HttpException(
        `A música de id ${songId} já está inclusa nessa apresentação!`,
        HttpStatus.BAD_REQUEST
      )
    }
  }

  // Adds member to the band
  async addSong(show: Show, song: Song): Promise<Show | null> {
    const { songs, id } = show
    const r = await this.showRepository.addSong(songs, song._id.toString(), id)
    return r
  }
}
