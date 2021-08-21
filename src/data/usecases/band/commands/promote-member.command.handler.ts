// Dependencies
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { ApolloError } from 'apollo-server-express'

// Commands
import { PromoteMemberCommand } from '@/data/protocols'

// Repositories and Schemas
import { BandRepository, AccountRepository } from '@/infra/db/mongodb'

// Domain Entities
import { Account, Band } from '@/domain/entities'

// Domain Protocols
import { RoleEnum } from '@/domain/protocols'

@CommandHandler(PromoteMemberCommand)
export class PromoteMemberHandler implements ICommandHandler<PromoteMemberCommand> {
  // Dependencies injection
  constructor(
    private readonly bandRepository: BandRepository,
    @Inject('AccountRepository') private readonly accountRepository: AccountRepository
  ) {}

  // Execute action handler
  async execute(command: PromoteMemberCommand): Promise<Band> {
    // Destruct params
    const { params: { accountId, bandId }, payload: { account } } = command

    // Step 1 - Retrieve account
    const retrievedAccount = await this.fetchAccount(accountId)
    if (!retrievedAccount) throw new ApolloError(`Conta de id ${accountId} não encontrada`)

    // Step 2 Retrieve current Account
    const currentAccount = await this.fetchAccount(account)
    if (!currentAccount) throw new ApolloError(`Conta de id ${account} não encontrada`)

    // Step 3 - Retrieve band
    const retrievedBand = await this.fetchBand(command)
    if (!retrievedBand) throw new ApolloError(`Banda de id ${bandId} não encontrada!`)

    // Step 4 - Validate Role and membership
    this.validateRole(command, retrievedBand, currentAccount)
    this.validateMember(retrievedBand, retrievedAccount)

    // Step 5 - Add member to band
    return await this.promoteMember(retrievedBand, retrievedAccount)
  }

  // Fetch account from database
  async fetchAccount(id: string): Promise<Account | null> {
    const account = await this.accountRepository.findOne({ id })
    return account
  }

  // Fetch band from database
  async fetchBand(command: PromoteMemberCommand): Promise<Band | null> {
    const { params: { bandId } } = command
    const band = await this.bandRepository.findOne({ id: bandId })
    return band
  }

  // Validates if is user is master
  validateRole(command: PromoteMemberCommand, band: Band, account: Account): void {
    const { payload: { role } } = command
    const { owner, admins } = band
    if (
      role === RoleEnum.player &&
      account._id.toString() !== owner &&
      !admins.includes(account._id.toString())
    ) {
      throw new ApolloError(`Você não tem permissão como ${RoleEnum.player} para atualizar dados dessa banda!`)
    }
  }

  // Validates if member is already in band
  validateMember(band: Band, account: Account): void {
    const { members, admins } = band
    const { _id: id, id: accountId } = account
    if (!members.includes(id.toString())) {
      throw new ApolloError(`A conta de id ${accountId} não é um integrante ativo dessa banda!`)
    }
    if (admins.includes(id.toString())) {
      throw new ApolloError(`A conta de id ${accountId} já é um admin dessa banda!`)
    }
  }

  // Promotes member from band
  async promoteMember(band: Band, account: Account): Promise<Band | null> {
    const { admins, id } = band
    const r = await this.bandRepository.promoteMember(admins, account._id.toString(), id)
    return r
  }
}