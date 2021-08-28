// Dependencies
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { ApolloError } from 'apollo-server-express'

// Commands
import { RemoveSongCommand } from '@/data/protocols'

// Repositories and Schemas
import { BandRepository, AccountRepository, SongRepository } from '@/infra/db/mongodb'

// Domain Entities
import { Account, Band, Song } from '@/domain/entities'

// Domain Protocols
import { RoleEnum } from '@/domain/protocols'

@CommandHandler(RemoveSongCommand)
export class RemoveSongHandler implements ICommandHandler<RemoveSongCommand> {
  // Dependencies injection
  constructor(
    private readonly songRepository: SongRepository,
    @Inject('BandRepository') private readonly bandRepository: BandRepository,
    @Inject('AccountRepository') private readonly accountRepository: AccountRepository
  ) {}

  // Execute action handler
  async execute(command: RemoveSongCommand): Promise<Song> {
    // Destruct params
    const { params: { id }, payload: { account } } = command

    // Step 1 Retrieve current Account
    const currentAccount = await this.fetchAccount(account)
    if (!currentAccount) throw new ApolloError(`Conta de id ${account} não encontrada`)

    // Step 2 - Retrieve song
    const retrievedSong = await this.fetchSong(command)
    if (!retrievedSong) throw new ApolloError(`Música de id ${id} não encontrada!`)

    // Step 3 - Retrieve band
    const currentBand = await this.fetchBand(retrievedSong)
    if (!currentBand) throw new ApolloError(`Banda na qual a música está vinculada não foi encontrada!`)

    // Step 3 - Validate Role and membership
    this.validateRole(command, currentBand, currentAccount)

    // Step 4 - Add member to band
    const result = await this.removeSong(command)
    if (!result) throw new ApolloError(`Erro ao remover música de id ${id}!`)
    return retrievedSong
  }

  // Fetch account from database
  async fetchAccount(id: string): Promise<Account | null> {
    const account = await this.accountRepository.findOne({ id })
    return account
  }

  // Fetch song from database
  async fetchSong(command: RemoveSongCommand): Promise<Song | null> {
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
  validateRole(command: RemoveSongCommand, band: Band, account: Account): void {
    const { payload: { role } } = command
    const { owner, admins } = band
    if (
      role === RoleEnum.player &&
      account._id.toString() !== owner &&
      !admins.includes(account._id.toString())
    ) {
      throw new ApolloError(`Você não tem permissão como ${RoleEnum.player} para atualizar dados dessa banda!`)
    }
  }

  // Removes data from song
  async removeSong(command: RemoveSongCommand): Promise<boolean> {
    const { params: { id } } = command
    const r = await this.songRepository.delete({ id })
    return r
  }
}