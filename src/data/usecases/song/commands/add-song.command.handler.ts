// Dependencies
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { ApolloError } from 'apollo-server-express'

// Commands
import { AddSongCommand } from '@/data/protocols'

// Repositories and Schemas
import { BandRepository, AccountRepository, SongRepository } from '@/infra/db/mongodb'

// Domain Entities
import { Account, Band, Song } from '@/domain/entities'

@CommandHandler(AddSongCommand)
export class AddSongHandler implements ICommandHandler<AddSongCommand> {
  // Dependencies injection
  constructor(
    private readonly songRepository: SongRepository,
    @Inject('BandRepository') private readonly bandRepository: BandRepository,
    @Inject('AccountRepository') private readonly accountRepository: AccountRepository
  ) {}

  // Execute action handler
  async execute(command: AddSongCommand): Promise<Song> {
    // Destruct params
    const { params: { band: bandId } } = command

    // Step 1 - Get authenticated account
    const account = await this.fetchAccount(command)
    if (!account) throw new ApolloError(`Conta de id ${command.payload.account} não foi encontrada!`, '404')

    // Step 2 - Get desired band
    const band = await this.fetchBand(command)
    if (!band) throw new ApolloError(`Band de id ${bandId} não encontrada!`)

    // Step 3 - Create song
    return await this.createSong(command, band)
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

  // Creates song into database
  async createSong(command: AddSongCommand, band: Band): Promise<Song | null> {
    const { _id  } = band
    const { params } = command
    const r = await this.songRepository.save({ 
      ...params, 
      band: _id.toString()
    })
    return r
  }
}