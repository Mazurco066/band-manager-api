// Dependencies
import { Inject } from '@nestjs/common'
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs'
import { ApolloError } from 'apollo-server-express'

// Commands
import { LoadShowQuery } from '@/data/protocols'

// Repositories and Schemas
import { BandRepository, ShowRepository, AccountRepository } from '@/infra/db/mongodb'

// Domain Entities
import { Account, Band, Show } from '@/domain/entities'

// Domain Protocols
import { RoleEnum } from '@/domain/protocols'

@QueryHandler(LoadShowQuery)
export class LoadShowHandler implements IQueryHandler<LoadShowQuery> {
  // Dependencies injection
  constructor(
    private readonly showRepository: ShowRepository,
    @Inject('BandRepository') private readonly bandRepository: BandRepository,
    @Inject('AccountRepository') private readonly accountRepository: AccountRepository
  ) {}

  // Execute action handler
  async execute(command: LoadShowQuery): Promise<Show> {
    // Destruct params
    const { params: { bandId, id }, payload: { account } } = command

    // Step 1 - Retrieve account and band
    const [ currentAccount, currentBand ] = await Promise.all([
      this.fetchAccount(account),
      this.fetchBand(bandId)
    ])
    if (!currentAccount) throw new ApolloError(`Conta de id ${account} não encontrada!`)
    if (!currentBand) throw new ApolloError(`Banda de id ${bandId} não foi encontrada!`)

    // Step 3 - Validate Role and membership
    this.validateRole(command, currentBand, currentAccount)

    // Step 4 - Load a song from a band
    const currentSong = await this.loadShow(command)
    if (!currentSong) throw new ApolloError(`Música de id ${id} não foi encontrada!`)
    return currentSong
  }

  // Fetch account from database
  async fetchAccount(id: string): Promise<Account | null> {
    const r = await this.accountRepository.findOne({ id })
    return r
  }

  // Fetch band from database
  async fetchBand(id: string): Promise<Band | null> {
    const r = await this.bandRepository.findOne({ id })
    return r
  }

  // Validates if is user is master
  validateRole(command: LoadShowQuery, band: Band, account: Account): void {
    const { payload: { role } } = command
    const { owner, members } = band
    if (
      role === RoleEnum.player &&
      account._id.toString() !== owner &&
      !members.includes(account._id.toString())
    ) {
      throw new ApolloError(`Você não tem permissão como ${RoleEnum.player} para carregar músicas dessa banda!`)
    }
  }

  // Loads a song from band
  async loadShow(command: LoadShowQuery): Promise<Show | null> {
    const { params: { id } } = command
    const r = await this.showRepository.findOnePopulated({ id })
    return r
  }
}
