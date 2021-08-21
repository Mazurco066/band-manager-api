// Dependencies
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { ApolloError } from 'apollo-server-express'

// Commands
import { UpdateBandCommand } from '@/data/protocols'

// Repositories and Schemas
import { BandRepository, AccountRepository } from '@/infra/db/mongodb'

// Domain Entities
import { Account, Band } from '@/domain/entities'

// Domain Protocols
import { RoleEnum } from '@/domain/protocols'

@CommandHandler(UpdateBandCommand)
export class UpdateBandHandler implements ICommandHandler<UpdateBandCommand> {
  // Dependencies injection
  constructor(
    private readonly bandRepository: BandRepository,
    @Inject('AccountRepository') private readonly accountRepository: AccountRepository
  ) {}

  // Execute action handler
  async execute(command: UpdateBandCommand): Promise<Band> {
    // Destruct params
    const { params: { id, description, title }, payload: { account } } = command

    // Step 1 Retrieve current Account
    const currentAccount = await this.fetchAccount(account)
    if (!currentAccount) throw new ApolloError(`Conta de id ${account} não encontrada`)

    // Step 2 - Retrieve band
    const retrievedBand = await this.fetchBand(command)
    if (!retrievedBand) throw new ApolloError(`Banda de id ${id} não encontrada!`)

    // Step 3 - Validate Role and membership
    this.validateRole(command, retrievedBand, currentAccount)

    // Step 4 - Add member to band
    return await this.updateBand(command)
  }

  // Fetch account from database
  async fetchAccount(id: string): Promise<Account | null> {
    const account = await this.accountRepository.findOne({ id })
    return account
  }

  // Fetch band from database
  async fetchBand(command: UpdateBandCommand): Promise<Band | null> {
    const { params: { id } } = command
    const band = await this.bandRepository.findOne({ id })
    return band
  }

  // Validates if is user is master
  validateRole(command: UpdateBandCommand, band: Band, account: Account): void {
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

  // Updates data from band
  async updateBand(command: UpdateBandCommand): Promise<Band | null> {
    const { params: { id, title, description } } = command
    if (!title && !description)
      throw new ApolloError('Nenhum dado foi informado para realizar a atualização da banda!')
    const r = await this.bandRepository.update({ title, description }, id)
    return r
  }
}