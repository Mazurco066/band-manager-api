// Dependencies
import { HttpException, HttpStatus, Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

// Commands
import { RemoveShowCommand } from '@/data/protocols'

// Repositories and Schemas
import { BandRepository, AccountRepository, ShowRepository } from '@/infra/db/mongodb'

// Domain Entities
import { Account, Band, Show } from '@/domain/entities'

// Domain Protocols
import { RoleEnum } from '@/domain/protocols'

@CommandHandler(RemoveShowCommand)
export class RemoveShowHandler implements ICommandHandler<RemoveShowCommand> {
  // Dependencies injection
  constructor(
    private readonly showRepository: ShowRepository,
    @Inject('BandRepository') private readonly bandRepository: BandRepository,
    @Inject('AccountRepository') private readonly accountRepository: AccountRepository
  ) {}

  // Execute action handler
  async execute(command: RemoveShowCommand): Promise<Show> {
    // Destruct params
    const { id, payload: { account } } = command

    // Step 1 - Retrieve current Account, show and band
    const [ currentAccount, retrievedShow ] = await Promise.all([
      this.fetchAccount(account),
      this.fetchShow(command),
    ])
    if (!currentAccount) throw new HttpException(
      `Conta de id ${account} não encontrada`,
      HttpStatus.NOT_FOUND
    )
    if (!retrievedShow) throw new HttpException(
      `Música de id ${id} não encontrada!`,
      HttpStatus.NOT_FOUND
    )

    // Step 2 - Retrieve current Band
    const currentBand = await this.fetchBand(retrievedShow)
    if (!currentBand) throw new HttpException(
      `Banda na qual a apresentação está vinculada não foi encontrada!`,
      HttpStatus.NOT_FOUND
    )

    // Step 3 - Validate Role and membership
    this.validateRole(command, currentBand, currentAccount)

    // Step 4 - Add member to band
    const result = await this.removeShow(command)
    if (!result) throw new HttpException(
      `Erro ao remover a apresentação de id ${id}!`,
      HttpStatus.INTERNAL_SERVER_ERROR
    )
    return retrievedShow
  }

  // Fetch account from database
  async fetchAccount(id: string): Promise<Account | null> {
    const account = await this.accountRepository.findOne({ id })
    return account
  }

  // Fetch show from database
  async fetchShow(command: RemoveShowCommand): Promise<Show | null> {
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
  validateRole(command: RemoveShowCommand, band: Band, account: Account): void {
    const { payload: { role } } = command
    const { owner, admins } = band
    if (
      role === RoleEnum.player &&
      account._id.toString() !== owner &&
      !admins.includes(account._id.toString())
    ) {
      throw new HttpException(
        `Você não tem permissão como ${RoleEnum.player} para atualizar dados dessa apresentação!`,
        HttpStatus.FORBIDDEN
      )
    }
  }

  // Removes data from show
  async removeShow(command: RemoveShowCommand): Promise<boolean> {
    const { id } = command
    const r = await this.showRepository.delete({ id })
    return r
  }
}