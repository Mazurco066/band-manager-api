// Dependencies
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { ApolloError } from 'apollo-server-express'

// Commands
import { UpdateSongCommand } from '@/data/protocols'

// Repositories and Schemas
import { BandRepository, SongRepository, AccountRepository } from '@/infra/db/mongodb'

// Domain Entities
import { Account, Band, Song } from '@/domain/entities'

// Domain Protocols
import { RoleEnum } from '@/domain/protocols'

@CommandHandler(UpdateSongCommand)
export class UpdateSongHandler implements ICommandHandler<UpdateSongCommand> {
  // Dependencies injection
  constructor(
    private readonly songRepository: SongRepository,
    @Inject('BandRepository') private readonly bandRepository: BandRepository,
    @Inject('AccountRepository') private readonly accountRepository: AccountRepository
  ) {}

  // Execute action handler
  async execute(command: UpdateSongCommand): Promise<Song> {
    // Destruct params
    const { params: { id }, payload: { account } } = command

    // Step 1 - Retrieve current Account
    const currentAccount = await this.fetchAccount(account)
    if (!currentAccount) throw new ApolloError(`Conta de id ${account} não encontrada!`)

    // Step 2 - Retrieve current song
    const currentSong = await this.fetchSong(command)
    if (!currentSong) throw new ApolloError(`Música de id ${id} não encontrada!`)

    // Step 3 - Retrieve band
    const currentBand = await this.fetchBand(currentSong)
    if (!currentBand) throw new ApolloError(`Banda na qual a música está vinculada não foi encontrada!`)

    // Step 4 - Validate Role and membership
    this.validateRole(command, currentBand, currentAccount)

    // Step 4 - Add member to band
    return await this.updateSong(command)
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

  // Validates if is user is master
  validateRole(command: UpdateSongCommand, band: Band, account: Account): void {
    const { payload: { role } } = command
    const { owner, admins } = band
    if (
      role === RoleEnum.player &&
      account._id.toString() !== owner &&
      !admins.includes(account._id.toString())
    ) {
      throw new ApolloError(`Você não tem permissão como ${RoleEnum.player} para atualizar dados dessa música!`)
    }
  }

  // Updates song from band
  async updateSong(command: UpdateSongCommand): Promise<Song | null> {
    const { params: { id, title, writter, body } } = command
    if (!title && !writter && !body)
      throw new ApolloError('Nenhum dado foi informado para realizar a atualização da música!')
    const r = await this.songRepository.update({ 
      title, writter, body 
    }, id)
    return r
  }
}