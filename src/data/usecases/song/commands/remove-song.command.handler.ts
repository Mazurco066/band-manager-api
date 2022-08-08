// Dependencies
import { HttpException, HttpStatus, Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

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
    const { id, payload: { account } } = command

    // Step 1 Retrieve current Account
    const currentAccount = await this.fetchAccount(account)
    if (!currentAccount) throw new HttpException(
      `Conta de id ${account} não encontrada`,
      HttpStatus.NOT_FOUND
    )

    // Step 2 - Retrieve song
    const retrievedSong = await this.fetchSong(command)
    if (!retrievedSong) throw new HttpException(
      `Música de id ${id} não encontrada!`,
      HttpStatus.NOT_FOUND
    )

    // Step 3 - Retrieve band
    const currentBand = await this.fetchBand(retrievedSong)
    if (!currentBand) throw new HttpException(
      `Banda na qual a música está vinculada não foi encontrada!`,
      HttpStatus.NOT_FOUND
    )

    // Step 3 - Validate Role and membership
    this.validateRole(command, currentBand, currentAccount)

    // Step 4 - Add member to band
    const result = await this.removeSong(command)
    if (!result) throw new HttpException(
      `Erro ao remover música de id ${id}!`,
      HttpStatus.INTERNAL_SERVER_ERROR
    )
    return retrievedSong
  }

  // Fetch account from database
  async fetchAccount(id: string): Promise<Account | null> {
    const account = await this.accountRepository.findOne({ id })
    return account
  }

  // Fetch song from database
  async fetchSong(command: RemoveSongCommand): Promise<Song | null> {
    const { id } = command
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
      throw new HttpException(
        `Você não tem permissão como ${RoleEnum.player} para atualizar dados dessa banda!`,
        HttpStatus.FORBIDDEN
      )
    }
  }

  // Removes data from song
  async removeSong(command: RemoveSongCommand): Promise<boolean> {
    const { id } = command
    const r = await this.songRepository.delete({ id })
    return r
  }
}
