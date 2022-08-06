// Dependencies
import { HttpException, HttpStatus, Inject } from '@nestjs/common'
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs'

// Commands
import { PendingInvitesQuery } from '@/data/protocols'

// Domain Entities
import { Account, Invite } from '@/domain/entities'

// Enums
import { ResponseEnum } from '@/domain/protocols'

// Repositories
import { AccountRepository, InviteRepository } from 'infra/db/mongodb'

@QueryHandler(PendingInvitesQuery)
export class PendingInvitesHandler implements IQueryHandler<PendingInvitesQuery> {
  // Dependencies injection
  constructor(
    private readonly inviteRepository: InviteRepository,
    @Inject('AccountRepository') private readonly accountRepository: AccountRepository
  ) {}

  // Execute action handler
  async execute(command: PendingInvitesQuery): Promise<Invite[]> {

    // Step 1 - Search for user account
    const retrievedAccount = await this.fetchAccount(command)
    if (!retrievedAccount) throw new HttpException(
      `Conta de id ${command.payload.account} não foi encontrada!`,
      HttpStatus.NOT_FOUND
    )

    // Step 2 - Retrieve pending invites
    const pendingInvites = await this.fetchInvites(retrievedAccount)

    // Returning
    return pendingInvites
  }

  // Fetch account
  async fetchAccount(command: PendingInvitesQuery): Promise<Account> {
    const { payload: { account } } = command
    const r = await this.accountRepository.findOne({ id: account })
    return r
  }

  // Fetch band from database
  async fetchInvites(account: Account): Promise<Invite[]> {
    const { _id } = account
    const invites = await this.inviteRepository.findPopulated({
      account: _id.toString(),
      response: ResponseEnum.pending
    }, { limit: 0, offset: 0 })
    return invites
  }
}
