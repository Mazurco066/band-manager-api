// Dependencies
import { HttpException, HttpStatus, Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

// Commands
import { DemoteMemberCommand } from '@/data/protocols'

// Repositories and Schemas
import { BandRepository, AccountRepository } from '@/infra/db/mongodb'

// Domain Entities
import { Account, Band } from '@/domain/entities'

// Domain Protocols
import { RoleEnum } from '@/domain/protocols'

@CommandHandler(DemoteMemberCommand)
export class DemoteMemberHandler implements ICommandHandler<DemoteMemberCommand> {
  // Dependencies injection
  constructor(
    private readonly bandRepository: BandRepository,
    @Inject('AccountRepository') private readonly accountRepository: AccountRepository
  ) {}

  // Execute action handler
  async execute(command: DemoteMemberCommand): Promise<Band> {
    // Destruct params
    const { params: { accountId, bandId }, payload: { account } } = command

    // Step 1 - Retrieve account
    const retrievedAccount = await this.fetchAccount(accountId)
    if (!retrievedAccount) throw new HttpException(
      `Conta de id ${accountId} não encontrada`,
      HttpStatus.NOT_FOUND
    )

    // Step 2 Retrieve current Account
    const currentAccount = await this.fetchAccount(account)
    if (!currentAccount) throw new HttpException(
      `Conta de id ${account} não encontrada`,
      HttpStatus.NOT_FOUND
    )

    // Step 3 - Retrieve band
    const retrievedBand = await this.fetchBand(command)
    if (!retrievedBand) throw new HttpException(
      `Banda de id ${bandId} não encontrada!`,
      HttpStatus.NOT_FOUND
    )

    // Step 4 - Validate Role and membership
    this.validateRole(command, retrievedBand, currentAccount)
    this.validateMember(retrievedBand, retrievedAccount)

    // Step 5 - Add member to band
    return await this.demoteMember(retrievedBand, retrievedAccount)
  }

  // Fetch account from database
  async fetchAccount(id: string): Promise<Account | null> {
    const account = await this.accountRepository.findOne({ id })
    return account
  }

  // Fetch band from database
  async fetchBand(command: DemoteMemberCommand): Promise<Band | null> {
    const { params: { bandId } } = command
    const band = await this.bandRepository.findOne({ id: bandId })
    return band
  }

  // Validates if is user is master
  validateRole(command: DemoteMemberCommand, band: Band, account: Account): void {
    const { payload: { role } } = command
    const { owner, admins } = band
    if (
      role === RoleEnum.player &&
      account._id.toString() !== owner &&
      !admins.includes(account._id.toString())
    ) {
      throw new HttpException(
        `Você não tem permissão como ${RoleEnum.player} para atualizar dados dessa banda!`,
        HttpStatus.UNAUTHORIZED
      )
    }
  }

  // Validates if member is already in band
  validateMember(band: Band, account: Account): void {
    const { members, admins } = band
    const { _id: id, id: accountId } = account
    if (!members.includes(id.toString())) {
      throw new HttpException(
        `A conta de id ${accountId} não é um integrante ativo dessa banda!`,
        HttpStatus.BAD_REQUEST
      )
    }
    if (!admins.includes(id.toString())) {
      throw new HttpException(
        `A conta de id ${accountId} não é um admin dessa banda!`,
        HttpStatus.BAD_REQUEST
      )
    }
  }

  // Demotes member from band
  async demoteMember(band: Band, account: Account): Promise<Band | null> {
    const { admins, members, id } = band
    const removeId = account._id.toString()
    const r = await this.bandRepository.removeMember(
      admins.filter(a => a !== removeId),
      members,
      id
    )
    return r
  }
}
