// Dependencies
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { ApolloError } from 'apollo-server-express'

// Commands
import { AddMemberCommand } from '@/data/protocols'

// Repositories and Schemas
import { AccountRepository, BandRepository, InviteRepository } from '@/infra/db/mongodb'

// Domain Entities
import { Account, Band, Invite } from '@/domain/entities'

// Domain Protocols
import { RoleEnum, ResponseEnum } from '@/domain/protocols'

@CommandHandler(AddMemberCommand)
export class AddMemberHandler implements ICommandHandler<AddMemberCommand> {
  // Dependencies injection
  constructor(
    private readonly bandRepository: BandRepository,
    private readonly inviteRepository: InviteRepository,
    @Inject('AccountRepository') private readonly accountRepository: AccountRepository
  ) {}

  // Execute action handler
  async execute(command: AddMemberCommand): Promise<Band> {
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
    await this.validateInvite(retrievedAccount, retrievedBand)

    // Step 5 - Add member to band
    const invite =  this.addMember(retrievedBand, retrievedAccount)
    if (!invite) throw new ApolloError(`Erro ao enviar convite para a conta: "${accountId}"`)

    // Return band
    return retrievedBand
  }

  // Fetch account from database
  async fetchAccount(id: string): Promise<Account | null> {
    const account = await this.accountRepository.findOne({ id })
    return account
  }

  // Fetch band from database
  async fetchBand(command: AddMemberCommand): Promise<Band | null> {
    const { params: { bandId } } = command
    const band = await this.bandRepository.findOne({ id: bandId })
    return band
  }

  // Validates if is user is master
  validateRole(command: AddMemberCommand, band: Band, account: Account): void {
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
    const { members } = band
    const { _id: id, id: accountId } = account
    if (members.includes(id.toString())) {
      throw new ApolloError(`A conta de id ${accountId} já é um integrante ativo dessa banda!`)
    }
  }

  // Validate if member is already invited
  async validateInvite(account: Account, band: Band) {
    const invite = await this.inviteRepository.findOne({
      account: account._id.toString(),
      band: band._id.toString()
    })
    if (invite && invite.response === ResponseEnum.pending) {
      throw new ApolloError(`A conta de id ${account.id} já possuí um convite ativo!`)
    }
  }

  // Adds member to the band
  async addMember(band: Band, account: Account): Promise<Invite | null> {
    const { _id: bandId } = band
    const { _id: accountId } = account
    const r = await this.inviteRepository.save({
        account: accountId.toString(),
        band: bandId.toString()
    })
    return r
  }
}