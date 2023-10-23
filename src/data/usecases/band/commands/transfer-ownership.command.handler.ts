// Dependencies
import { HttpException, HttpStatus, Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

// Commands
import { TransferOwnershipCommand } from '@/data/protocols'

// Repositories and Schemas
import { BandRepository, AccountRepository } from '@/infra/db/mongodb'

// Domain Entities
import { Account, Band } from '@/domain/entities'

// Domain Protocols
import { RoleEnum } from '@/domain/protocols'

@CommandHandler(TransferOwnershipCommand)
export class TransferOwnershipHandler implements ICommandHandler<TransferOwnershipCommand> {
  // Dependencies injection
  constructor(
    private readonly bandRepository: BandRepository,
    @Inject('AccountRepository') private readonly accountRepository: AccountRepository
  ) {}

  // Execute action handler
  async execute(command: TransferOwnershipCommand): Promise<Band> {
    // Destruct params
    const { bandId, params: { accountId }, payload: { account } } = command

    // Step 1 - Retrieve accounts and band
    const [ retrievedAccount, currentAccount, retrievedBand ] = await Promise.all([
      this.fetchAccount(accountId),
      this.fetchAccount(account),
      this.fetchBand(command)
    ])
    if (!retrievedAccount) throw new HttpException(
      `Conta de id ${accountId} não encontrada`,
      HttpStatus.NOT_FOUND
    )
    if (!currentAccount) throw new HttpException(
      `Conta de id ${account} não encontrada`,
      HttpStatus.NOT_FOUND
    )
    if (!retrievedBand) throw new HttpException(
      `Banda de id ${bandId} não encontrada!`,
      HttpStatus.NOT_FOUND
    )

    // Step 4 - Validate Role and membership
    this.validateRole(command, retrievedBand, currentAccount)
    this.validateMember(retrievedBand, retrievedAccount)

    // Step 5 - Transfer ownership
    return await this.transferOwnership(retrievedBand, currentAccount, retrievedAccount)
  }

  // Fetch account from database
  async fetchAccount(id: string): Promise<Account | null> {
    const account = await this.accountRepository.findOne({ id })
    return account
  }

  // Fetch band from database
  async fetchBand(command: TransferOwnershipCommand): Promise<Band | null> {
    const { bandId } = command
    const band = await this.bandRepository.findOne({ id: bandId })
    return band
  }

  // Validates if is user is master
  validateRole(command: TransferOwnershipCommand, band: Band, account: Account): void {
    const { payload: { role } } = command
    const { owner } = band
    if (
      role === RoleEnum.player &&
      account._id.toString() !== owner
    ) {
      throw new HttpException(
        `Você deve ser o lider atual da banda para transferir a liderança!`,
        HttpStatus.FORBIDDEN
      )
    }
  }

  // Validates if member is already in band
  validateMember(band: Band, account: Account): void {
    const { members } = band
    const { _id: id, id: accountId } = account
    if (!members.includes(id.toString())) {
      throw new HttpException(
        `A conta de id ${accountId} não é um integrante ativo dessa banda!`,
        HttpStatus.BAD_REQUEST
      )
    }
  }

  // Transfer ownwership
  async transferOwnership(band: Band, from: Account, to: Account) {
    const { id, admins } = band
    const { _id: fromId } = from
    const { _id: toId } = to
    const currentOwner = fromId.toString()
    const newOwner = toId.toString()
    const r = await this.bandRepository.transferOwnership(id, newOwner, currentOwner, admins.filter(a => a !== currentOwner))
    return r
  }
}
