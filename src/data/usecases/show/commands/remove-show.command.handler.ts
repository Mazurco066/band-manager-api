// Dependencies
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { ApolloError } from 'apollo-server-express'

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
    const { params: { id }, payload: { account } } = command

    // Step 1 - Retrieve current Account, show and band
    const [ currentAccount, retrievedShow ] = await Promise.all([
      this.fetchAccount(account),
      this.fetchShow(command),
    ])
    if (!currentAccount) throw new ApolloError(`Conta de id ${account} não encontrada`)
    if (!retrievedShow) throw new ApolloError(`Música de id ${id} não encontrada!`)

    // Step 2 - Retrieve current Band
    const currentBand = await this.fetchBand(retrievedShow)
    if (!currentBand) throw new ApolloError(`Banda na qual a apresentação está vinculada não foi encontrada!`)

    // Step 3 - Validate Role and membership
    this.validateRole(command, currentBand, currentAccount)

    // Step 4 - Add member to band
    const result = await this.removeShow(command)
    if (!result) throw new ApolloError(`Erro ao remover a apresentação de id ${id}!`)
    return retrievedShow
  }

  // Fetch account from database
  async fetchAccount(id: string): Promise<Account | null> {
    const account = await this.accountRepository.findOne({ id })
    return account
  }

  // Fetch show from database
  async fetchShow(command: RemoveShowCommand): Promise<Show | null> {
    const { params: { id } } = command
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
      throw new ApolloError(`Você não tem permissão como ${RoleEnum.player} para atualizar dados dessa apresentação!`)
    }
  }

  // Removes data from show
  async removeShow(command: RemoveShowCommand): Promise<boolean> {
    const { params: { id } } = command
    const r = await this.showRepository.delete({ id })
    return r
  }
}