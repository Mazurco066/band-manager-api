// Dependencies
import { HttpException, HttpStatus, Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

// Commands
import { CloneConcertCommand } from '@/data/protocols'

// Repositories and Schemas
import { BandRepository, AccountRepository, ShowRepository } from '@/infra/db/mongodb'

// Domain Entities
import { Account, Band, Show } from '@/domain/entities'

// Domain Protocols
import { RoleEnum } from '@/domain/protocols'

@CommandHandler(CloneConcertCommand)
export class CloneConcertHandler implements ICommandHandler<CloneConcertCommand> {
  // Dependencies injection
  constructor(
    private readonly showRepository: ShowRepository,
    @Inject('BandRepository') private readonly bandRepository: BandRepository,
    @Inject('AccountRepository') private readonly accountRepository: AccountRepository
  ) {}

  // Execute action handler
  async execute(command: CloneConcertCommand): Promise<Show> {
    // Destruct params
    const { showId, payload: { account } } = command

    // Step 1 - Retrieve account and show
    const [ currentAccount, currentShow ] = await Promise.all([
      this.fetchAccount(account),
      this.fetchShow(command)
    ])
    if (!currentAccount) throw new HttpException(
      `Conta de id ${account} não encontrada`,
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

    // Step 3 - Validate Role
    this.validateRole(command, retrievedBand, currentAccount)

    // Step 4 - Add song to show
    return await this.cloneShow(command, currentShow)
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
  async fetchShow(command: CloneConcertCommand): Promise<Show | null> {
    const { showId } = command
    const r = await this.showRepository.findOne({ id: showId })
    return r
  }

  // Validates if is user is player
  validateRole(command: CloneConcertCommand, band: Band, account: Account): void {
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

  // Clone concert into band
  async cloneShow(command: CloneConcertCommand, show: Show): Promise<Show | null> {
    const { params: { date } } = command
    const { band, description, songs, title } = show
    const newShow = await this.showRepository.save({
      band,
      date: new Date(date),
      title: `${title} - Copy`,
      description,
      songs,
    })
    return newShow
  }
}
