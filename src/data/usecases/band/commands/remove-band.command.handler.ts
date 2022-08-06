// Dependencies
import { HttpException, HttpStatus, Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

// Commands
import { RemoveBandCommand } from '@/data/protocols'

// Repositories and Schemas
import { BandRepository, AccountRepository } from '@/infra/db/mongodb'

// Domain Entities
import { Account, Band } from '@/domain/entities'

// Domain Protocols
import { RoleEnum } from '@/domain/protocols'

@CommandHandler(RemoveBandCommand)
export class RemoveBandHandler implements ICommandHandler<RemoveBandCommand> {
  // Dependencies injection
  constructor(
    private readonly bandRepository: BandRepository,
    @Inject('AccountRepository') private readonly accountRepository: AccountRepository
  ) {}

  // Execute action handler
  async execute(command: RemoveBandCommand): Promise<Band> {
    // Destruct params
    const { params: { id }, payload: { account } } = command

    // Step 1 Retrieve current Account
    const currentAccount = await this.fetchAccount(account)
    if (!currentAccount) throw new HttpException(
      `Conta de id ${account} não encontrada`,
      HttpStatus.NOT_FOUND
    )

    // Step 2 - Retrieve band
    const retrievedBand = await this.fetchBand(command)
    if (!retrievedBand) throw new HttpException(
      `Banda de id ${id} não encontrada!`,
      HttpStatus.NOT_FOUND
    )

    // Step 3 - Validate Role and membership
    this.validateRole(command, retrievedBand, currentAccount)

    // Step 4 - Add member to band
    const result = await this.removeBand(command)
    if (!result) throw new HttpException(
      `Erro ao remover banda de id ${id}!`,
      HttpStatus.INTERNAL_SERVER_ERROR
    )
    return retrievedBand
  }

  // Fetch account from database
  async fetchAccount(id: string): Promise<Account | null> {
    const account = await this.accountRepository.findOne({ id })
    return account
  }

  // Fetch band from database
  async fetchBand(command: RemoveBandCommand): Promise<Band | null> {
    const { params: { id } } = command
    const band = await this.bandRepository.findOne({ id })
    return band
  }

  // Validates if is user is master
  validateRole(command: RemoveBandCommand, band: Band, account: Account): void {
    const { payload: { role } } = command
    const { owner } = band
    if (role === RoleEnum.player && account._id.toString() !== owner) {
      throw new HttpException(
        `Você não tem permissão como ${RoleEnum.player} para atualizar dados dessa banda!`,
        HttpStatus.FORBIDDEN
      )
    }
  }

  // Removes data from band
  async removeBand(command: RemoveBandCommand): Promise<boolean> {
    const { params: { id } } = command
    const r = await this.bandRepository.delete({ id })
    return r
  }
}