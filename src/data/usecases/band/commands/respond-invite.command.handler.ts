// Dependencies
import { HttpException, HttpStatus, Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

// Commands
import { RespondInviteCommand } from '@/data/protocols'

// Repositories and Schemas
import { AccountRepository, BandRepository, InviteRepository } from '@/infra/db/mongodb'

// Domain Entities
import { Account, Band, Invite } from '@/domain/entities'

// Domain Protocols
import { ResponseEnum } from '@/domain/protocols'

@CommandHandler(RespondInviteCommand)
export class RespondInviteHandler implements ICommandHandler<RespondInviteCommand> {
  // Dependencies injection
  constructor(
    private readonly bandRepository: BandRepository,
    private readonly inviteRepository: InviteRepository,
    @Inject('AccountRepository') private readonly accountRepository: AccountRepository
  ) {}

  // Execute action handler
  async execute(command: RespondInviteCommand): Promise<Band> {
    // Destruct params
    const { params: { inviteId, response }, payload: { account } } = command

    // Step 1 - Retrieve account and invite
    const [ currentAccount, retrievedInvite ] = await Promise.all([
      this.fetchAccount(account),
      this.fetchInvite(command)
    ])

    // Step 2 - Verify if retrieved data exists
    if (!currentAccount) throw new HttpException(
      `Conta de id ${account} não encontrada`,
      HttpStatus.NOT_FOUND
    )
    if (!retrievedInvite) throw new HttpException(
      `Convite de id ${inviteId} não encontrado!`,
      HttpStatus.NOT_FOUND
    )

    // Step 2.1 - Validate if invite is expired
    if (retrievedInvite.response !== ResponseEnum.pending) {
      throw new HttpException(
        `Convite de id ${inviteId} já foi respondido!`,
        HttpStatus.NOT_FOUND
      )
    }

    // Step 3 - Validate if band and account still exists
    const [ retrievedBand,retrievedAccount ] = await Promise.all([
      this.fetchBand(retrievedInvite.band),
      this.fetchAccountById(retrievedInvite.account)
    ])
    if (!retrievedBand) throw new HttpException(
      `Banda vinculada ao convite não encontrada!`,
      HttpStatus.NOT_FOUND  
    )
    if (!retrievedAccount) throw new HttpException(
      `Conta vinculada ao convite não encontrada`,
      HttpStatus.NOT_FOUND
    )

    // Step 3.1 - Validate if authenticated user and the invite target arte the same users
    if (retrievedAccount.id !== currentAccount.id) {
      throw new HttpException(
        'A conta autenticada deve ser a pessoa que recebeu o convite!',
        HttpStatus.BAD_REQUEST
      )
    }

    // Step 4 - Validate Role and membership
    this.validateMember(retrievedBand, retrievedAccount)

    // Step 5 - Update invite and add member to band if he/she agreed
    await this.updateInvite(command, retrievedInvite)
    if (response === ResponseEnum.accepted) {
      const updatedBand = this.addMember(retrievedBand, retrievedAccount)
      return updatedBand
    }

    // Denied - then return band
    return retrievedBand
  }

  // Fetch account from database
  async fetchAccount(id: string): Promise<Account | null> {
    const account = await this.accountRepository.findOne({ id })
    return account
  }

  // Fetch account from database by _id
  async fetchAccountById(id: string): Promise<Account | null> {
    const account = await this.accountRepository.findOne({ _id: id })
    return account
  }

  // Fetch band from database
  async fetchBand(id: string): Promise<Band | null> {
    const band = await this.bandRepository.findOne({ _id: id })
    return band
  }

  // Fetch band from database
  async fetchInvite(command: RespondInviteCommand): Promise<Invite | null> {
    const { params: { inviteId } } = command
    const invite = await this.inviteRepository.findOne({ id: inviteId })
    return invite
  }

  // Validates if member is already in band
  validateMember(band: Band, account: Account): void {
    const { members } = band
    const { _id: id, id: accountId } = account
    if (members.includes(id.toString())) {
      throw new HttpException(
        `A conta de id ${accountId} já é um integrante ativo dessa banda!`,
        HttpStatus.BAD_REQUEST
      )
    }
  }

  // Update invite
  async updateInvite(command: RespondInviteCommand, invite: Invite): Promise<Invite> {
    const { params: { response } } = command
    const { id } = invite
    const r = await this.inviteRepository.update({ response }, id)
    return r
  }

  // Adds member to the band
  async addMember(band: Band, account: Account): Promise<Band | null> {
    const { members, id } = band
    const r = await this.bandRepository.addMember(members, account._id.toString(), id)
    return r
  }
}
