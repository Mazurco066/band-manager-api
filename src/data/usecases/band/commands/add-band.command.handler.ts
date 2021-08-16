// Dependencies
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { ApolloError } from 'apollo-server-express'

// Commands
import { AddBandCommand } from '@/data/protocols'

// Repositories and Schemas
import { BandRepository, AccountRepository } from '@/infra/db/mongodb'

// Domain Entities
import { Account, Band } from '@/domain/entities'

@CommandHandler(AddBandCommand)
export class AddBandHandler implements ICommandHandler<AddBandCommand> {
  // Dependencies injection
  constructor(
    private readonly bandRepository: BandRepository,
    @Inject('AccountRepository') private readonly accountRepository: AccountRepository
  ) {}

  // Execute action handler
  async execute(command: AddBandCommand): Promise<Band> {
    // Step 1 - Get authenticated account
    const account = await this.fetchAccount(command)
    if (!account) throw new ApolloError(`Conta de id ${command.payload.account} não foi encontrada!`, '404')

    // Step 2 - Store band
    return await this.createBand(command, account)
  }

  // Fetch account from database
  async fetchAccount(command: AddBandCommand): Promise<Account | null> {
    const { payload: { account: id } } = command
    const account = await this.accountRepository.findOne({ id })
    return account
  }

  // Create band handler
  async createBand(command: AddBandCommand, account: Account): Promise<Band> {
    const { params } = command
    return await this.bandRepository.save({
      ...params,
      owner: account._id,
      members: [account._id]
    })
  }
}