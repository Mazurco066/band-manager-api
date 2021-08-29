// Dependencies
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { ApolloError } from 'apollo-server-express'

// Commands
import { UpdateCategoryCommand } from '@/data/protocols'

// Repositories and Schemas
import { BandRepository, AccountRepository, CategoryRepository } from '@/infra/db/mongodb'

// Domain Entities
import { Account, Band, Category } from '@/domain/entities'

// Domain Protocols
import { RoleEnum } from '@/domain/protocols'

@CommandHandler(UpdateCategoryCommand)
export class UpdateCategoryHandler implements ICommandHandler<UpdateCategoryCommand> {
  // Dependencies injection
  constructor(
    private readonly categoryRepository: CategoryRepository,
    @Inject('BandRepository') private readonly bandRepository: BandRepository,
    @Inject('AccountRepository') private readonly accountRepository: AccountRepository
  ) {}

  // Execute action handler
  async execute(command: UpdateCategoryCommand): Promise<Category> {
    // Destruct params
    const { params: { id } } = command

    // Step 1 - Get authenticated account
    const account = await this.fetchAccount(command)
    if (!account) throw new ApolloError(`Conta de id ${command.payload.account} não foi encontrada!`, '404')

    // Step 2 - Get Category
    const category = await this.fetchCategory(command)
    if (!category) throw new ApolloError(`Categoria de id ${id} não foi encontrada!`, '404')

    // Step 3 - Get desired category
    const band = await this.fetchBand(category)
    if (!band) throw new ApolloError(`Banda vinculada a categoria atual não encontrada!`)

    // Step 4 - Validate if user is able to update the category
    this.validateRole(command, band, account)

    // Step 5 - Update Category
    return await this.updateCategory(command)
  }

  // Fetch account from database
  async fetchAccount(command: UpdateCategoryCommand): Promise<Account | null> {
    const { payload: { account: id } } = command
    const account = await this.accountRepository.findOne({ id })
    return account
  }

  // Fetch category from database
  async fetchCategory(command: UpdateCategoryCommand): Promise<Category | null> {
    const { params: { id } } = command
    const r = await this.categoryRepository.findOne({ id })
    return r
  }

  // Fetch band from database
  async fetchBand(category: Category): Promise<Band | null> {
    const { band } = category
    const r = await this.bandRepository.findOne({ _id: band.toString() })
    return r
  }

  // Validates if is user is master
  validateRole(command: UpdateCategoryCommand, band: Band, account: Account): void {
    const { payload: { role } } = command
    const { owner, admins } = band
    if (
      role === RoleEnum.player &&
      account._id.toString() !== owner &&
      !admins.includes(account._id.toString())
    ) {
      throw new ApolloError(`Você não tem permissão como ${RoleEnum.player} para atualizar dados dessa categoria!`)
    }
  }

  // Updates category into database
  async updateCategory(command: UpdateCategoryCommand): Promise<Category | null> {
    const { params: { id, title, description } } = command
    if (!title && !description)
      throw new ApolloError('Nenhum dado foi informado para realizar a atualização da categoria!')
    const { params } = command
    const r = await this.categoryRepository.update({ ...params  }, id)
    return r
  }
}