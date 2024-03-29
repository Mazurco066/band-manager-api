// Dependencies
import { HttpException, HttpStatus, Inject } from '@nestjs/common'
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs'

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
    const { id, payload: { account } } = command

    // Step 1 - Retrieve account and show
    const [ currentAccount, currentShow ] = await Promise.all([
      this.fetchAccount(account),
      this.loadShow(command)
    ])
    if (!currentAccount) throw new HttpException(
      `Conta de id ${account} não encontrada!`,
      HttpStatus.NOT_FOUND
    )
    if (!currentShow) throw new HttpException(
      `Apresentação de id ${id} não foi encontrada!`,
      HttpStatus.NOT_FOUND
    )

    // Step 2 - Retrieve band
    const currentBand = await this.fetchBand(currentShow.band)
    if (!currentBand) throw new HttpException(
      `Banda não encontrada!`,
      HttpStatus.NOT_FOUND
    )

    // Step 3 - Validate Role and membership
    this.validateRole(command, currentBand, currentAccount)
  
    // Return show
    return currentShow
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
  validateRole(command: LoadShowQuery, band: Band, account: Account): void {
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
  async loadShow(command: LoadShowQuery): Promise<Show | null> {
    const { id } = command
    const r = await this.showRepository.findOnePopulated({ id })
    return r
  }
}
