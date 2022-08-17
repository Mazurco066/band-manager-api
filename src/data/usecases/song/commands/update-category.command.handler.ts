// Dependencies
import { HttpException, HttpStatus, Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

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
    const { id } = command

    // Step 1 - Get authenticated account
    const account = await this.fetchAccount(command)
    if (!account) throw new HttpException(
      `Conta de id ${command.payload.account} não foi encontrada!`,
      HttpStatus.NOT_FOUND
    )

    // Step 2 - Get Category
    const category = await this.fetchCategory(command)
    if (!category) throw new HttpException(
      `Categoria de id ${id} não foi encontrada!`,
      HttpStatus.NOT_FOUND
    )

    // Step 3 - Get desired category
    const band = await this.fetchBand(category)
    if (!band) throw new HttpException(
      `Banda vinculada a categoria atual não encontrada!`,
      HttpStatus.NOT_FOUND
    )

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
    const { id } = command
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
      throw new HttpException(
        `Você não tem permissão como ${RoleEnum.player} para atualizar dados dessa categoria!`,
        HttpStatus.FORBIDDEN
      )
    }
  }

  // Updates category into database
  async updateCategory(command: UpdateCategoryCommand): Promise<Category | null> {
    const { id, params: { title, description } } = command
    if (!title && !description)
      throw new HttpException(
        'Nenhum dado foi informado para realizar a atualização da categoria!',
        HttpStatus.BAD_REQUEST
      )
    const { params } = command
    const r = await this.categoryRepository.update({ ...params  }, id)
    return r
  }
}