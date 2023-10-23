// Dependencies
import { HttpException, HttpStatus, Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

// Commands
import { RemoveAccountAndBandDataCommand } from '@/data/protocols'

// Repositories and Schemas
import { BandRepository, AccountRepository, SongRepository } from '@/infra/db/mongodb'

// Domain Entities
import { Account, Band, Song } from '@/domain/entities'

@CommandHandler(RemoveAccountAndBandDataCommand)
export class RemoveAccountAndBandDataHandler implements ICommandHandler<RemoveAccountAndBandDataCommand> {
  // Dependencies injection
  constructor(
    private readonly songRepository: SongRepository,
    @Inject('BandRepository') private readonly bandRepository: BandRepository,
    @Inject('AccountRepository') private readonly accountRepository: AccountRepository
  ) {}

  // Execute action handler
  async execute(command: RemoveAccountAndBandDataCommand): Promise<Account> {
    // Destruct params
    const { payload: { account } } = command

    // Step 1 - Retrieve current Account
    const userAccount = await this.fetchAccount(account)
    if (!userAccount) throw new HttpException(
      `Conta de id ${account} não encontrada`,
      HttpStatus.NOT_FOUND
    )

    // Step 2 - Retrieve bands where this user is ownner or member
    const [
      userBandsAsOwner,
      userBandsAsMember
    ] = await Promise.all([
      this.fetchOwnedBands(userAccount),
      this.fetchRelatedBands(userAccount)
    ])

    // Step 2.1 - Remove this member from the bands
    if (userBandsAsMember.length > 0) {
      await Promise.all(
        userBandsAsMember.map(band => this.removeMember(band, userAccount))
      )
    }

    // Step 2.2 - If user bands as owner has songs retrieve them and remove
    if (userBandsAsOwner.length > 0) {
      // Step 3 - Retrieve songs related to the band
      const songResponses = await Promise.all(
        userBandsAsOwner.map(band => this.fetchBandSongs(band))
      )

      // Step 3.1 - Unify song array
      const allSongs = songResponses.reduce((acc, cv) => acc.concat(cv) ,[])

      // Step 4 - Map songs and delete them
      await Promise.all(allSongs.map(song => this.removeSong(song)))

      // Step 5 - Delete owned band
      await Promise.all(userBandsAsOwner.map(band => this.removeBand(band)))
    }

    // Final step - delete and return account
    const isDeleted = await this.removeAccount(userAccount)
    if (!isDeleted) throw new HttpException(
      'Erro ao remover a conta! Por favor tente novamente mais tarde.',
      HttpStatus.INTERNAL_SERVER_ERROR
    )
    return userAccount
  }

  // Fetch account from database
  async fetchAccount(id: string): Promise<Account | null> {
    const account = await this.accountRepository.findOne({ id })
    return account
  }

  // Fetch owned bands from database
  async fetchOwnedBands(account: Account): Promise<Band[]> {
    const bands = await this.bandRepository.find({
      owner: account._id.toString()
    })
    return bands
  }

  // Fetch related bands from database
  async fetchRelatedBands(account: Account): Promise<Band[]> {
    const bands = await this.bandRepository.find({
      members: account._id.toString()
    })
    return bands
  }

  // Fetch band songs
  async fetchBandSongs(band: Band): Promise<Song[]> {
    const songs = await this.songRepository.find({
      band: band._id.toString()
    })
    return songs
  }

  // Remove member from band
  async removeMember(band: Band, account: Account): Promise<Band | null> {
    const { admins, members, id } = band
    const removeId = account._id.toString()
    const r = await this.bandRepository.removeMember(
      admins.filter(a => a !== removeId),
      members.filter(m => m !== removeId),
      id
    )
    return r
  }

  // Removes data from given band
  async removeBand(band: Band): Promise<boolean> {
    const { id } = band
    const r = await this.bandRepository.delete({ id })
    return r
  }

  // Removes data from song
  async removeSong(song: Song): Promise<boolean> {
    const { id } = song
    const r = await this.songRepository.delete({ id })
    return r
  }

  // Remove account from database
  async removeAccount(account: Account): Promise<boolean> {
    const { id } = account
    const r = await this.accountRepository.delete({ id })
    return r
  }
}
