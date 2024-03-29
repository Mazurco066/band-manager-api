// Dependencies
import { HttpException, HttpStatus, Inject } from '@nestjs/common'
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs'

// Commands
import { LoadSongQuery } from '@/data/protocols'

// Repositories and Schemas
import { BandRepository, SongRepository, AccountRepository } from '@/infra/db/mongodb'

// Domain Entities
import { Account, Band, Song } from '@/domain/entities'

// Domain Protocols
import { RoleEnum } from '@/domain/protocols'

@QueryHandler(LoadSongQuery)
export class LoadSongHandler implements IQueryHandler<LoadSongQuery> {
  // Dependencies injection
  constructor(
    private readonly songRepository: SongRepository,
    @Inject('BandRepository') private readonly bandRepository: BandRepository,
    @Inject('AccountRepository') private readonly accountRepository: AccountRepository
  ) {}

  // Execute action handler
  async execute(command: LoadSongQuery): Promise<Song> {
    // Destruct params
    const { id, payload: { account } } = command

    // Step 1 - Retrieve current Account, band and song
    const [ currentAccount, currentSong ] = await Promise.all([
      this.fetchAccount(account),
      this.loadSong(command)
    ])
   
    // Step 2 - Verify if all data is persisted
    if (!currentAccount) throw new HttpException(
      `Conta de id ${account} não encontrada!`,
      HttpStatus.NOT_FOUND
    )
    if (!currentSong) throw new HttpException(
      `Música de id ${id} não foi encontrada!`,
      HttpStatus.NOT_FOUND
    )

    // Step 2.1 - Retrieve band based on song
    const currentBand = await this.fetchBand(currentSong.band)
    if (!currentBand) throw new HttpException(
      `Banda não encontrada!`,
      HttpStatus.NOT_FOUND
    )

    // Step 3 - Validate Role and membership if song is not public
    if (!currentSong.isPublic) {
      this.validateRole(command, currentBand, currentAccount)
    }
    
    // Step 4 - Load a song from a band
    return currentSong
  }

  // Fetch account from database
  async fetchAccount(id: string): Promise<Account | null> {
    const r = await this.accountRepository.findOne({ id })
    return r
  }

  // Fetch band from database
  async fetchBand(id: string): Promise<Band | null> {
    const r = await this.bandRepository.findOne({ _id: id })
    return r
  }

  // Validates if is user is master
  validateRole(command: LoadSongQuery, band: Band, account: Account): void {
    const { payload: { role } } = command
    const { owner, members } = band
    if (
      role === RoleEnum.player &&
      account._id.toString() !== owner &&
      !members.includes(account._id.toString())
    ) {
      throw new HttpException(
        `Você não tem permissão como ${RoleEnum.player} para carregar músicas dessa banda!`,
        HttpStatus.FORBIDDEN
      )
    }
  }

  // Loads a song from band
  async loadSong(command: LoadSongQuery): Promise<Song | null> {
    const { id } = command
    const r = await this.songRepository.findOnePopulated({ id })
    return r
  }
}
