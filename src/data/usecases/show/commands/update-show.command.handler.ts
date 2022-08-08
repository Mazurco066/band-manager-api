// Dependencies
import { HttpException, HttpStatus, Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

// Commands
import { UpdateShowCommand } from '@/data/protocols'

// Repositories and Schemas
import { BandRepository, ShowRepository, AccountRepository } from '@/infra/db/mongodb'

// Domain Entities
import { Account, Band, Show } from '@/domain/entities'

// Domain Protocols
import { RoleEnum } from '@/domain/protocols'

@CommandHandler(UpdateShowCommand)
export class UpdateShowHandler implements ICommandHandler<UpdateShowCommand> {
  // Dependencies injection
  constructor(
    private readonly showRepository: ShowRepository,
    @Inject('BandRepository') private readonly bandRepository: BandRepository,
    @Inject('AccountRepository') private readonly accountRepository: AccountRepository
  ) {}

  // Execute action handler
  async execute(command: UpdateShowCommand): Promise<Show> {
    // Destruct params
    const { id, payload: { account } } = command

    // Step 1 - Retrieve current Account and show
    const [ currentAccount, currentShow ] = await Promise.all([
      this.fetchAccount(account),
      this.fetchShow(command)
    ])
    if (!currentAccount) throw new HttpException(
      `Conta de id ${account} não encontrada!`,
      HttpStatus.NOT_FOUND
    )
    if (!currentShow) throw new HttpException(
      `Apresentação de id ${id} não encontrada!`,
      HttpStatus.NOT_FOUND
    )

    // Step 3 - Retrieve band
    const currentBand = await this.fetchBand(currentShow)
    if (!currentBand) throw new HttpException(
      `Banda na qual a apresentação está vinculada não foi encontrada!`,
      HttpStatus.NOT_FOUND
    )

    // Step 4 - Validate Role and membership
    this.validateRole(command, currentBand, currentAccount)

    // Step 4 - Add member to band
    return await this.updateShow(command)
  }

  // Fetch account from database
  async fetchAccount(id: string): Promise<Account | null> {
    const r = await this.accountRepository.findOne({ id })
    return r
  }

  // Fetch show from database
  async fetchShow(command: UpdateShowCommand): Promise<Show | null> {
    const { id } = command
    const r = await this.showRepository.findOne({ id })
    return r
  }

  // Fetch band from database
  async fetchBand(show: Show): Promise<Band | null> {
    const { band } = show
    const r = await this.bandRepository.findOne({ _id: band })
    return r
  }

  // Validates if is user is master
  validateRole(command: UpdateShowCommand, band: Band, account: Account): void {
    const { payload: { role } } = command
    const { owner, admins } = band
    if (
      role === RoleEnum.player &&
      account._id.toString() !== owner &&
      !admins.includes(account._id.toString())
    ) {
      throw new HttpException(
        `Você não tem permissão como ${RoleEnum.player} para atualizar dados dessa música!`,
        HttpStatus.FORBIDDEN
      )
    }
  }

  // Updates show from band
  async updateShow(command: UpdateShowCommand): Promise<Show | null> {
    const { id, params: { title, description, date } } = command
    const payload = { title, description }
    if (date) payload['date'] = new Date(date)
    if (!title && !description)
      throw new HttpException(
        'Nenhum dado foi informado para realizar a atualização da música!',
        HttpStatus.BAD_REQUEST
      )
    const r = await this.showRepository.update(payload, id)
    return r
  }
}
