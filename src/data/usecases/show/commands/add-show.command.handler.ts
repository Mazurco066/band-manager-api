// Dependencies
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { ApolloError } from 'apollo-server-express'

// Commands
import { AddShowCommand } from '@/data/protocols'

// Repositories and Schemas
import { BandRepository, AccountRepository, ShowRepository } from '@/infra/db/mongodb'

// Domain Entities
import { Account, Band, Show } from '@/domain/entities'

// Domain Protocols
import { RoleEnum } from '@/domain/protocols'

@CommandHandler(AddShowCommand)
export class AddShowHandler implements ICommandHandler<AddShowCommand> {
  // Dependencies injection
  constructor(
    private readonly showRepository: ShowRepository,
    @Inject('BandRepository') private readonly bandRepository: BandRepository,
    @Inject('AccountRepository') private readonly accountRepository: AccountRepository
  ) {}

  // Execute action handler
  async execute(command: AddShowCommand): Promise<Show> {
    // Destruct params
    const { params: { band: bandId,  } } = command

    // Step 1 - Retrieve account and band
    const [ account, band ] = await Promise.all([
      this.fetchAccount(command),
      this.fetchBand(command)
    ])
    if (!account) throw new ApolloError(`Conta de id ${command.payload.account} não foi encontrada!`, '404')
    if (!band) throw new ApolloError(`Band de id ${bandId} não encontrada!`)

    // Step 2 - Validate if user is able to create a playlist
    this.validateRole(command, account, band)

    // Step 3 - Create show
    return await this.createShow(command, band)
  }

  // Fetch account from database
  async fetchAccount(command: AddShowCommand): Promise<Account | null> {
    const { payload: { account: id } } = command
    const account = await this.accountRepository.findOne({ id })
    return account
  }

  // Fetch band from database
  async fetchBand(command: AddShowCommand): Promise<Band | null> {
    const { params: { band } } = command
    const r = await this.bandRepository.findOne({ id: band })
    return r
  }

  // Validates user role
  validateRole(command: AddShowCommand, account: Account, band: Band): void {
    const { payload: { role } } = command
    const { owner, admins } = band
    if (
      role === RoleEnum.player &&
      account._id.toString() !== owner &&
      !admins.includes(account._id.toString())
    ) {
      throw new ApolloError(`Você não tem permissão como ${RoleEnum.player} para criar uma apresentação!`)
    }
  }

  // Creates show into database
  async createShow(command: AddShowCommand, band: Band): Promise<Show | null> {
    const { _id  } = band
    const { params } = command
    const r = await this.showRepository.save({ ...params, band: _id.toString() })
    return r
  }
}
