// Dependencies
import { HttpException, HttpStatus, Inject } from '@nestjs/common'
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs'

// Commands
import { LoadPublicSongQuery } from '@/data/protocols'

// Repositories and Schemas
import { BandRepository, SongRepository, AccountRepository } from '@/infra/db/mongodb'

// Domain Entities
import { Account, Band, Song } from '@/domain/entities'

@QueryHandler(LoadPublicSongQuery)
export class LoadPublicSongHandler implements IQueryHandler<LoadPublicSongQuery> {
  // Dependencies injection
  constructor(
    private readonly songRepository: SongRepository,
    @Inject('BandRepository') private readonly bandRepository: BandRepository,
    @Inject('AccountRepository') private readonly accountRepository: AccountRepository
  ) {}

  // Execute action handler
  async execute(command: LoadPublicSongQuery): Promise<Song> {
    // Destruct params
    const { id } = command

    // Step 1 - Retrieve current Account, band and song
    const currentSong = await this.loadSong(command)
   
    // Step 2 - Verify if all data is persisted
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

  // Loads a song from band
  async loadSong(command: LoadPublicSongQuery): Promise<Song | null> {
    const { id } = command
    const r = await this.songRepository.findOnePopulated({ id, isPublic: true })
    return r
  }
}
